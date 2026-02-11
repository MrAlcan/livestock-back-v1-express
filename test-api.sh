#!/bin/bash

echo "Matando procesos anteriores..."
pkill -f "ts-node-dev" 2>/dev/null
sleep 2

echo "Iniciando API..."
npm run dev > /tmp/api-start.log 2>&1 &
API_PID=$!

echo "Esperando 15 segundos..."
for i in {1..15}; do
  echo -n "."
  sleep 1
done
echo ""

echo "Verificando logs..."
cat /tmp/api-start.log

echo ""
echo "Probando health endpoint..."
curl -v http://localhost:3000/api/health 2>&1 | head -20

echo ""
echo "Matando proceso..."
kill $API_PID 2>/dev/null
