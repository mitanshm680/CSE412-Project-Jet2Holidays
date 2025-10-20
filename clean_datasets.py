#!/usr/bin/env python3
"""
Script to create a smaller, consistent subset of airline datasets.
Strategy: Sample routes first, then extract related airports and airlines.

Enhancements:
- Configurable sample size and random seed via CLI args
- Avoid SettingWithCopyWarning by working on explicit copies
- Recompute final airport/airline subsets after referential filtering
- Stable (sorted) outputs for determinism
"""

import argparse
import pandas as pd
import random

# Set random seed for reproducibility
random.seed(42)

parser = argparse.ArgumentParser(description="Clean and sample OpenFlights datasets")
parser.add_argument("--routes", type=int, default=350, help="Number of routes to sample (default: 350)")
parser.add_argument("--seed", type=int, default=42, help="Random seed (default: 42)")
parser.add_argument("--routes-path", default="routes.dat", help="Path to routes.dat (default: routes.dat)")
parser.add_argument("--airports-path", default="airports.dat", help="Path to airports.dat (default: airports.dat)")
parser.add_argument("--airlines-path", default="airlines.dat", help="Path to airlines.dat (default: airlines.dat)")
parser.add_argument("--planes-path", default="planes.dat", help="Path to planes.dat (default: planes.dat)")
parser.add_argument("--countries-path", default="countries.dat", help="Path to countries.dat (default: countries.dat)")
parser.add_argument("--routes-out", default="routes_small.dat", help="Output path for sampled routes (default: routes_small.dat)")
parser.add_argument("--airports-out", default="airports_small.dat", help="Output path for filtered airports (default: airports_small.dat)")
parser.add_argument("--airlines-out", default="airlines_small.dat", help="Output path for filtered airlines (default: airlines_small.dat)")
parser.add_argument("--planes-out", default="planes_small.dat", help="Output path for filtered planes (default: planes_small.dat)")
parser.add_argument("--countries-out", default="countries_small.dat", help="Output path for filtered countries (default: countries_small.dat)")

args = parser.parse_args()

# Set random seed for reproducibility
random.seed(args.seed)

print("Loading datasets...")

# Load routes.dat
routes_cols = ['Airline', 'AirlineID', 'SourceAirport', 'SourceAirportID', 
               'DestAirport', 'DestAirportID', 'Codeshare', 'Stops', 'Equipment']
routes = pd.read_csv(args.routes_path, header=None, names=routes_cols, na_values=['\\N'])

# Load airports.dat
airports_cols = ['AirportID', 'Name', 'City', 'Country', 'IATA', 'ICAO', 
                 'Latitude', 'Longitude', 'Altitude', 'Timezone', 'DST', 
                 'TzDatabase', 'Type', 'Source']
airports = pd.read_csv(args.airports_path, header=None, names=airports_cols, na_values=['\\N'])

# Load airlines.dat
airlines_cols = ['AirlineID', 'Name', 'Alias', 'IATA', 'ICAO', 'Callsign', 
                 'Country', 'Active']
airlines = pd.read_csv(args.airlines_path, header=None, names=airlines_cols, na_values=['\\N'])

# planes.dat (optional)
planes = None
try:
    planes_cols = ['Name', 'IATA', 'ICAO']
    planes = pd.read_csv(args.planes_path, header=None, names=planes_cols, na_values=['\\N'])
except FileNotFoundError:
    print(f"  Note: {args.planes_path} not found, will skip planes_small.dat generation")

# countries.dat (optional)
countries = None
try:
    countries_cols = ['Name', 'ISO2', 'FIPS']
    countries = pd.read_csv(args.countries_path, header=None, names=countries_cols, na_values=['\\N'])
except FileNotFoundError:
    print(f"  Note: {args.countries_path} not found, will skip countries_small.dat generation")

print(f"Original sizes:")
print(f"  Routes: {len(routes)}")
print(f"  Airports: {len(airports)}")
print(f"  Airlines: {len(airlines)}")

# Clean routes: remove rows with missing airport/airline IDs and coerce types
print("\nCleaning routes (removing missing IDs and coercing types)...")
routes_clean = routes.dropna(subset=['SourceAirportID', 'DestAirportID']).copy()
routes_clean.loc[:, 'SourceAirportID'] = routes_clean['SourceAirportID'].astype(int)
routes_clean.loc[:, 'DestAirportID'] = routes_clean['DestAirportID'].astype(int)
routes_clean.loc[:, 'AirlineID'] = pd.to_numeric(routes_clean['AirlineID'], errors='coerce')
routes_clean = routes_clean.dropna(subset=['AirlineID']).copy()
routes_clean.loc[:, 'AirlineID'] = routes_clean['AirlineID'].astype(int)

print(f"  Routes after cleaning: {len(routes_clean)}")

# Sample routes randomly
sample_n = min(args.routes, len(routes_clean))
print(f"\nSampling {sample_n} routes...")
sample_routes = routes_clean.sample(n=sample_n, random_state=args.seed)

# Extract unique airport and airline IDs from the sampled routes
print("Extracting related airports and airlines...")
airport_ids = set(sample_routes['SourceAirportID']) | set(sample_routes['DestAirportID'])
airline_ids = set(sample_routes['AirlineID'])

print(f"  Unique airports involved: {len(airport_ids)}")
print(f"  Unique airlines involved: {len(airline_ids)}")

# Prepare airports and airlines tables with proper dtypes
airports = airports.dropna(subset=['AirportID']).copy()
airports.loc[:, 'AirportID'] = airports['AirportID'].astype(int)

airlines = airlines.dropna(subset=['AirlineID']).copy()
airlines.loc[:, 'AirlineID'] = pd.to_numeric(airlines['AirlineID'], errors='coerce')
airlines = airlines.dropna(subset=['AirlineID']).copy()
airlines.loc[:, 'AirlineID'] = airlines['AirlineID'].astype(int)

airports_small = airports[airports['AirportID'].isin(airport_ids)].copy()
airlines_small = airlines[airlines['AirlineID'].isin(airline_ids)].copy()

# Verify referential integrity
print("\nVerifying referential integrity...")
missing_airlines = airline_ids - set(airlines_small['AirlineID'])
missing_airports = airport_ids - set(airports_small['AirportID'])

if missing_airlines:
    print(f"  WARNING: {len(missing_airlines)} airline IDs in routes not found in airlines table")
    # Filter out routes with missing airlines
    sample_routes = sample_routes[sample_routes['AirlineID'].isin(airlines_small['AirlineID'])].copy()

if missing_airports:
    print(f"  WARNING: {len(missing_airports)} airport IDs in routes not found in airports table")
    # Filter out routes with missing airports
    sample_routes = sample_routes[
        sample_routes['SourceAirportID'].isin(airports_small['AirportID']) &
        sample_routes['DestAirportID'].isin(airports_small['AirportID'])
    ].copy()

# Recompute final airport and airline sets post-filtering and tighten tables
final_airport_ids = set(sample_routes['SourceAirportID']) | set(sample_routes['DestAirportID'])
final_airline_ids = set(sample_routes['AirlineID'])

airports_small = airports[airports['AirportID'].isin(final_airport_ids)].copy()
airlines_small = airlines[airlines['AirlineID'].isin(final_airline_ids)].copy()

print(f"\nFinal subset sizes:")
print(f"  Routes: {len(sample_routes)}")
print(f"  Airports: {len(airports_small)}")
print(f"  Airlines: {len(airlines_small)}")

planes_small_out = None

# Derive countries_small from airports/airlines country usage
countries_small_out = None
if countries is not None:
    print("  Deriving countries_small from airports/airlines usage...")
    airport_countries = set(airports_small['Country'].dropna().unique())
    airline_countries = set(airlines_small['Country'].dropna().unique())
    used_countries = airport_countries | airline_countries
    countries_small = countries[countries['Name'].isin(used_countries)].copy()
    missing_countries = used_countries - set(countries_small['Name'])
    if missing_countries:
        print(f"  WARNING: {len(missing_countries)} country names from airports/airlines not found in countries.dat; related airports/airlines and routes will be dropped")
    countries_small_out = countries_small.sort_values(by=['Name'])
    # Restrict airports/airlines to only those with valid canonical country names
    valid_country_names = set(countries_small_out['Name'])
    airports_small = airports_small[airports_small['Country'].isin(valid_country_names)].copy()
    airlines_small = airlines_small[airlines_small['Country'].isin(valid_country_names)].copy()
    # Since we may have removed some airports/airlines, drop routes that reference them
    valid_airport_ids = set(airports_small['AirportID'])
    valid_airline_ids = set(airlines_small['AirlineID'])
    sample_routes = sample_routes[
        sample_routes['SourceAirportID'].isin(valid_airport_ids) &
        sample_routes['DestAirportID'].isin(valid_airport_ids) &
        sample_routes['AirlineID'].isin(valid_airline_ids)
    ].copy()
    # Recompute final sets again to keep tight alignment
    final_airport_ids = set(sample_routes['SourceAirportID']) | set(sample_routes['DestAirportID'])
    final_airline_ids = set(sample_routes['AirlineID'])
    airports_small = airports[airports['AirportID'].isin(final_airport_ids) & airports['Country'].isin(valid_country_names)].copy()
    airlines_small = airlines[airlines['AirlineID'].isin(final_airline_ids) & airlines['Country'].isin(valid_country_names)].copy()
    # Optionally, recompute countries_small_out to only those still used
    used_countries_final = set(airports_small['Country'].dropna().unique()) | set(airlines_small['Country'].dropna().unique())
    countries_small_out = countries[countries['Name'].isin(used_countries_final)].sort_values(by=['Name']).copy()

# Derive planes_small from equipment in routes AFTER final filtering
if planes is not None:
    print("  Deriving planes_small from route equipment codes...")
    equip_series = sample_routes['Equipment'].dropna().astype(str)
    equipment_codes = (
        equip_series.str.split().explode().str.strip().str.upper().dropna().unique()
    )
    equip_set = set(equipment_codes)
    planes_small = planes[
        planes['IATA'].isin(equip_set) | planes['ICAO'].isin(equip_set)
    ].copy()
    planes_small_out = planes_small.sort_values(by=['IATA', 'ICAO', 'Name'])
    print(f"  Planes: {len(planes_small_out)} (from {len(equip_set)} codes in routes)")
    print(f"  Countries: {len(countries_small_out)} (from {len(used_countries)} used)")

# Save the cleaned, smaller datasets
print("\nSaving cleaned datasets...")

# Sort outputs for stable diffs and determinism
sample_routes_out = sample_routes.sort_values(by=[
    'AirlineID', 'SourceAirportID', 'DestAirportID', 'Airline', 'SourceAirport', 'DestAirport'
])
airports_small_out = airports_small.sort_values(by=['AirportID'])
airlines_small_out = airlines_small.sort_values(by=['AirlineID'])

sample_routes_out.to_csv(args.routes_out, header=False, index=False, na_rep='\\N')
airports_small_out.to_csv(args.airports_out, header=False, index=False, na_rep='\\N')
airlines_small_out.to_csv(args.airlines_out, header=False, index=False, na_rep='\\N')

# Optional outputs
if planes_small_out is not None:
    planes_small_out.to_csv(args.planes_out, header=False, index=False, na_rep='\\N')
if countries_small_out is not None:
    countries_small_out.to_csv(args.countries_out, header=False, index=False, na_rep='\\N')

print("\n Done! Created:")
print("  - routes_small.dat")
print("  - airports_small.dat")
print("  - airlines_small.dat")

# Display some sample data
print("\n" + "="*60)
print("Sample Routes (first 5):")
print("="*60)
print(sample_routes_out.head())

print("\n" + "="*60)
print("Sample Airports (first 5):")
print("="*60)
print(airports_small_out.head())

print("\n" + "="*60)
print("Sample Airlines (first 5):")
print("="*60)
print(airlines_small_out.head())

if planes_small_out is not None:
    print("\n" + "="*60)
    print("Sample Planes (first 5):")
    print("="*60)
    print(planes_small_out.head())

if countries_small_out is not None:
    print("\n" + "="*60)
    print("Sample Countries (first 5):")
    print("="*60)
    print(countries_small_out.head())
