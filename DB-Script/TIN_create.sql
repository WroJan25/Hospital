-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-01-03 12:52:43.598

-- tables
-- Table: Choroby
CREATE TABLE Choroby (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nazwa varchar(20)  NOT NULL,
    Symptomy varchar(500)  NOT NULL,
    Skala_Zakaznosci integer  NULL
) ;

-- Table: Ksiazeczka_Zdrowia
CREATE TABLE Ksiazeczka_Zdrowia (
    Pacjent_Id_Pacjenta integer  NOT NULL,
    Choroby_Id integer  NOT NULL,
    Lekarz_Id_Lekarza integer  NOT NULL,
    Wykrycie date  NOT NULL,
    CONSTRAINT Ksiazeczka_Zdrowia_pk PRIMARY KEY (Pacjent_Id_Pacjenta,Choroby_Id)
) ;

-- Table: Lekarz
CREATE TABLE Lekarz (
    Id_Lekarza integer  NOT NULL,
    Identyfikator integer  NOT NULL,
    Data_Zatrudnienia date  NOT NULL,
    Specjalizacja_lekarza integer  NOT NULL,
    CONSTRAINT Lekarz_pk PRIMARY KEY (Id_Lekarza)
) ;

-- Table: Pacjent
CREATE TABLE Pacjent (
    Id_Pacjenta integer  NOT NULL,
    Identyfikator integer  NOT NULL,
    CONSTRAINT Pacjent_pk PRIMARY KEY (Id_Pacjenta)
) ;

-- Table: Specjalizacja
CREATE TABLE Specjalizacja (
    Id integer  NOT NULL,
    Nazwa_Specjalizacji varchar(30)  NOT NULL,
    CONSTRAINT Specjalizacja_pk PRIMARY KEY (Id)
) ;

-- Table: Uzytkownik
CREATE TABLE Uzytkownik (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Imie varchar(20)  NOT NULL,
    Nazwisko varchar(20)  NOT NULL,
    Email varchar(100)  NOT NULL,
    Pesel varchar(11)  NOT NULL,
    Haslo varchar(200)  NOT NULL
) ;

-- foreign keys
-- Reference: Ksiazeczka_Zdrowia_Choroby (table: Ksiazeczka_Zdrowia)
ALTER TABLE Ksiazeczka_Zdrowia ADD CONSTRAINT Ksiazeczka_Zdrowia_Choroby
    FOREIGN KEY (Choroby_Id)
    REFERENCES Choroby (Id);

-- Reference: Ksiazeczka_Zdrowia_Lekarz (table: Ksiazeczka_Zdrowia)
ALTER TABLE Ksiazeczka_Zdrowia ADD CONSTRAINT Ksiazeczka_Zdrowia_Lekarz
    FOREIGN KEY (Lekarz_Id_Lekarza)
    REFERENCES Lekarz (Id_Lekarza);

-- Reference: Ksiazeczka_Zdrowia_Pacjent (table: Ksiazeczka_Zdrowia)
ALTER TABLE Ksiazeczka_Zdrowia ADD CONSTRAINT Ksiazeczka_Zdrowia_Pacjent
    FOREIGN KEY (Pacjent_Id_Pacjenta)
    REFERENCES Pacjent (Id_Pacjenta);

-- Reference: Lekarz_Specjalizacja (table: Lekarz)
ALTER TABLE Lekarz ADD CONSTRAINT Lekarz_Specjalizacja
    FOREIGN KEY (Specjalizacja_lekarza)
    REFERENCES Specjalizacja (Id);

-- Reference: Lekarz_Uzytkownik (table: Lekarz)
ALTER TABLE Lekarz ADD CONSTRAINT Lekarz_Uzytkownik
    FOREIGN KEY (Id_Lekarza)
    REFERENCES Uzytkownik (id);

-- Reference: Table_2_Uzytkownik (table: Pacjent)
ALTER TABLE Pacjent ADD CONSTRAINT Table_2_Uzytkownik
    FOREIGN KEY (Id_Pacjenta)
    REFERENCES Uzytkownik (id);


-- End of file.

