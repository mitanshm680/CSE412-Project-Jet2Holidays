CREATE TABLE Countries (
    Name VARCHAR(100) PRIMARY KEY,
    ISO_Code VARCHAR(2),
    DAFIF_Code VARCHAR(2)
);

CREATE TABLE Airlines (
    AirlineID INTEGER PRIMARY KEY,
    Name VARCHAR(100),
    Alias VARCHAR(100),
    IATA VARCHAR(2),
    ICAO VARCHAR(3),
    Callsign VARCHAR(50),
    Country VARCHAR(100),
    Active CHAR(1) CHECK (Active IN ('Y', 'N')),
    FOREIGN KEY (Country) REFERENCES Countries (Name)
);

CREATE TABLE Airports (
    AirportID INTEGER PRIMARY KEY,
    Name VARCHAR(100),
    City VARCHAR(100),
    Country VARCHAR(100),
    IATA VARCHAR(3),
    ICAO VARCHAR(4),
    Latitude DOUBLE PRECISION,
    Longitude DOUBLE PRECISION,
    Altitude DOUBLE PRECISION,
    Timezone DOUBLE PRECISION,
    DST VARCHAR(1),
    TzDatabaseTimezone VARCHAR(50),
    TYPE VARCHAR(20),
    Source VARCHAR(20),
    FOREIGN KEY (Country) REFERENCES Countries (Name)
);

CREATE TABLE Planes (
    Name VARCHAR(100),
    IATACode VARCHAR(3) PRIMARY KEY,
    ICAOCode VARCHAR(4)
);

CREATE TABLE Routes (
    Airline VARCHAR(3),
    AirlineID INTEGER,
    SourceAirport VARCHAR(4),
    SourceAirportID INTEGER,
    DestinationAirport VARCHAR(4),
    DestinationAirportID INTEGER,
    Codeshare CHAR(1) CHECK (Codeshare IN ('Y', '') OR Codeshare IS NULL),
    Stops INTEGER,
    Equipment VARCHAR(3),
    PRIMARY KEY (AirlineID, SourceAirportID, DestinationAirportID, Equipment),
    FOREIGN KEY (AirlineID) REFERENCES Airlines (AirlineID),
    FOREIGN KEY (SourceAirportID) REFERENCES Airports (AirportID),
    FOREIGN KEY (DestinationAirportID) REFERENCES Airports (AirportID),
    FOREIGN KEY (Equipment) REFERENCES Planes (IATACode)
);