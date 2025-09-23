ALTER TABLE health_records
ADD COLUMN importance_level INTEGER CHECK (importance_level >= 1 AND importance_level <= 5);