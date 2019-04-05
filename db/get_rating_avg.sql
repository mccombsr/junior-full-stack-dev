SELECT ROUND(AVG(rating), 1)
FROM ratings
WHERE ron_quote = $1;