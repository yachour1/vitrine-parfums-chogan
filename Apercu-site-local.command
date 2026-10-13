#!/bin/zsh
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd '/Users/yasslagazelle/Desktop/Projet Parfum/Vitrine-de-parfums-catalogue-Chogan' || exit 1
echo "Aperçu exporté : http://localhost:5173 — arrêter avec Ctrl+C"
python3 -m http.server 5173 --bind 127.0.0.1 --directory artifacts/parfums/dist/public
