INSERT INTO Uzytkownik (id, Imie, Nazwisko, Email, Pesel, Haslo) VALUES
(1, 'Admin', 'Admin', 'admin@example.com', '00000000000', 'hashedpassword'),
(2, 'Jan', 'Kowalski', 'jan.kowalski@example.com', '12345678901', 'hashedpassword'),
(3, 'Anna', 'Nowak', 'anna.nowak@example.com', '23456789012', 'hashedpassword'),
(4, 'Marek', 'Zieliński', 'marek.zielinski@example.com', '34567890123', 'hashedpassword'),
(5, 'Ewa', 'Wiśniewska', 'ewa.wisniewska@example.com', '45678901234', 'hashedpassword'),
(6, 'Piotr', 'Dąbrowski', 'piotr.dabrowski@example.com', '56789012345', 'hashedpassword'),
(7, 'Tomasz', 'Kaczmarek', 'tomasz.kaczmarek@example.com', '67890123456', 'hashedpassword'),
(8, 'Katarzyna', 'Wojciechowska', 'katarzyna.wojciechowska@example.com', '78901234567', 'hashedpassword'),
(9, 'Grzegorz', 'Nowicki', 'grzegorz.nowicki@example.com', '89012345678', 'hashedpassword'),
(10, 'Magdalena', 'Sikora', 'magdalena.sikora@example.com', '90123456789', 'hashedpassword'),
(11, 'Jakub', 'Piotrowski', 'jakub.piotrowski@example.com', '01234567890', 'hashedpassword'),
(12, 'Alicja', 'Kwiatkowska', 'alicja.kwiatkowska@example.com', '12345098765', 'hashedpassword'),
(13, 'Paweł', 'Mazur', 'pawel.mazur@example.com', '23456109876', 'hashedpassword'),
(14, 'Iwona', 'Kaczmarek', 'iwona.kaczmarek@example.com', '34567210987', 'hashedpassword'),
(15, 'Rafał', 'Wróbel', 'rafal.wrobel@example.com', '45678321098', 'hashedpassword'),
(16, 'Barbara', 'Woźniak', 'barbara.wozniak@example.com', '56789432109', 'hashedpassword'),
(17, 'Marek', 'Kowalski', 'marek.kowalski@example.com', '67890543210', 'hashedpassword'),
(18, 'Jan', 'Nowak', 'jan.nowak@example.com', '78901654321', 'hashedpassword'),
(19, 'Ewa', 'Zawisza', 'ewa.zawisza@example.com', '89012765432', 'hashedpassword'),
(20, 'Krzysztof', 'Nowak', 'krzysztof.nowak@example.com', '90123876543', 'hashedpassword'),
(21, 'Sylwia', 'Różańska', 'sylwia.rozanska@example.com', '01234987654', 'hashedpassword'),
(22, 'Adam', 'Kwiatkowski', 'adam.kwiatkowski@example.com', '12345678901', 'hashedpassword'),
(23, 'Agnieszka', 'Sikorska', 'agnieszka.sikorska@example.com', '23456789012', 'hashedpassword'),
(24, 'Kamil', 'Wójcik', 'kamil.wojcik@example.com', '34567890123', 'hashedpassword');

-- Inserty do tabeli Choroby
INSERT INTO Choroby (Id, Nazwa, Symptomy, Skala_Zakaznosci) VALUES
(1, 'Grypa', 'Ból głowy, kaszel, gorączka', 3),
(2, 'Zapalenie płuc', 'Ból w klatce piersiowej, trudności w oddychaniu', 4),
(3, 'Ospa wietrzna', 'Swędzące pęcherze, gorączka', 2),
(4, 'Cukrzyca', 'Pragnienie, częste oddawanie moczu, zmęczenie', 1);

-- Inserty do tabeli Specjalizacja
INSERT INTO Specjalizacja (Id, Nazwa_Specjalizacji) VALUES
(1, 'Internista'),
(2, 'Kardiolog'),
(3, 'Dermatolog'),
(4, 'Pediatra');

-- Inserty do tabeli Lekarz (użytkownicy będący lekarzami)
-- Inserty do tabeli Lekarz (użytkownicy będący lekarzami)
INSERT INTO Lekarz (Id_Lekarza, Identyfikator, Data_Zatrudnienia, Specjalizacja_lekarza) VALUES
(2, 1001, '2022-05-15', 1),
(3, 1002, '2021-03-10', 2),
(4, 1003, '2020-07-20', 3),
(5, 1004, '2019-11-25', 4),
(7, 1005, '2023-01-01', 1),
(8, 1006, '2022-06-01', 2),
(9, 1007, '2021-10-01', 3),
(10, 1008, '2020-05-15', 4),
(11, 1009, '2019-07-12', 1),
(12, 1010, '2023-03-22', 2),
(13, 1011, '2022-11-05', 3),
(14, 1012, '2020-09-10', 4),
(15, 1013, '2019-01-01', 1),
(16, 1014, '2023-06-05', 2);


-- Inserty do tabeli Pacjent (użytkownicy będący pacjentami)
-- Inserty do tabeli Pacjent (użytkownicy będący pacjentami)
INSERT INTO Pacjent (Id_Pacjenta, Identyfikator) VALUES
(6, 1001),
(17, 1002),
(18, 1003),
(19, 1004),
(20, 1005),
(21, 1006),
(22, 1007),
(23, 1008);


INSERT INTO Ksiazeczka_Zdrowia (Pacjent_Id_Pacjenta, Choroby_Id, Lekarz_Id_Lekarza, Wykrycie) VALUES
(6, 1, 2, '2022-05-20'),
(17, 2, 3, '2022-04-15'),
(18, 3, 4, '2021-08-10'),
(19, 4, 5, '2020-12-05'),
(20, 1, 7, '2023-02-10'),
(21, 1, 8, '2023-03-05'),
(22, 2, 9, '2023-04-01'),
(23, 3, 10, '2022-11-15');

