SELECT * FROM images;

SELECT * FROM images ORDER BY date DESC;

SELECT * FROM images ORDER BY date DESC LIMIT 3;

SELECT * FROM images WHERE date > "2022-01-01";

SELECT * FROM images WHERE likes > 10;

SELECT * FROM images WHERE orientation_id IN (SELECT id FROM orientations WHERE type = "portrait" OR type = "paysage");

SELECT * FROM images WHERE auteur_id = (SELECT id FROM auteurs WHERE nom = "Duchamp" AND prenom = "Marcel");

SELECT * FROM images 
WHERE auteur_id = (SELECT id FROM auteurs WHERE nom = 'Duchamp' AND prenom = 'Marcel') 
AND orientation_id = (SELECT id FROM orientations WHERE type = 'portrait');

SELECT SUM(likes) AS total_likes FROM images 
WHERE auteur_id = (SELECT id FROM auteurs WHERE nom = 'Duchamp' AND prenom = 'Marcel');

SELECT * FROM commentaires WHERE image_id = 28;

SELECT * FROM images ORDER BY likes DESC LIMIT 1;
