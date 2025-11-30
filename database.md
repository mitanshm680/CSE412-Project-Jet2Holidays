### Load Data in Order

**IMPORTANT:** Load in this specific order due to foreign key dependencies!

#### Connect to Database
```bash
psql -d jet2holidays
```

#### Load Countries (First - No Dependencies)
```sql
\COPY Countries(Name, ISO_Code, DAFIF_Code) 
FROM 'countries_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### Load Airlines (Depends on Countries)
```sql
\COPY Airlines(AirlineID, Name, Alias, IATA, ICAO, Callsign, Country, Active) 
FROM 'airlines_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### Load Airports (Depends on Countries)
```sql
\COPY Airports(AirportID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, TzDatabaseTimezone, TYPE, Source) FROM 'airports_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### Load Planes (No Dependencies)
```sql
\COPY Planes(Name, IATACode, ICAOCode) 
FROM 'planes_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### Load Routes (Depends on Airlines, Airports, Planes)
```sql
\COPY Routes(Airline, AirlineID, SourceAirport, SourceAirportID, DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment) 
FROM 'routes_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### Tables
'''sql
SELECT 'Countries' as table_name, COUNT(*) as row_count FROM Countries
UNION ALL
SELECT 'Airlines', COUNT(*) FROM Airlines
UNION ALL
SELECT 'Airports', COUNT(*) FROM Airports
UNION ALL
SELECT 'Planes', COUNT(*) FROM Planes
UNION ALL
SELECT 'Routes', COUNT(*) FROM Routes;
'''
### Insert queries

'''sql
INSERT INTO Routes (Airline, AirlineID, SourceAirport, SourceAirportID, DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment) VALUES ('AA', 24, 'PHX', 3462, 'JFK', 3797, NULL, 0, '320');
'''

### Update queries

'''sql
UPDATE Routes 
SET Equipment = '737' 
WHERE Airline = 'AA' AND SourceAirport = 'PHX' AND DestinationAirport   = 'JFK' AND Equipment = '320';
'''



### Setect queries

'''sql
SELECT * FROM Routes WHERE Airline = 'AA' AND SourceAirport = 'PHX' AND DestinationAirport = 'JFK' AND Equipment = '737';
'''

'''sql
SELECT
   r.airline,
   r.sourceairport,
   r.destinationairport,
   r.equipment AS aircraft_code,
   p.name AS aircraft_model
FROM routes r
LEFT JOIN planes p ON r.equipment = p.iatacode
WHERE r.airline = 'UX';
'''

### Delete queries

'''sql
DELETE FROM Routes WHERE Airline = 'AA' AND SourceAirport = 'PHX' AND DestinationAirport = 'JFK' AND Equipment = '737';
'''