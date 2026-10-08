#!/bin/bash
# Esperar a que Kafka esté listo
echo "Esperando a que Kafka arrancar..."
cub kafka-ready -b kafka:9092 1 20

# Crear los 4 tópicos de la POC con 3 particiones cada uno (según pide el TP)
kafka-topics.sh --create --if-not-exists --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1 --topic activation.requested
kafka-topics.sh --create --if-not-exists --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1 --topic billing.events
kafka-topics.sh --create --if-not-exists --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1 --topic provisioning.events
kafka-topics.sh --create --if-not-exists --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1 --topic activation.events

echo "¡Tópicos creados exitosamente!"