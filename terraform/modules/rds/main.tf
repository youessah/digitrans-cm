resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-rds-subnets"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "${var.project_name}-${var.environment}-rds-subnets" }
}

resource "aws_db_instance" "main" {
  identifier        = "${var.project_name}-${var.environment}-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  storage_type      = "gp3"
  storage_encrypted = true
  db_name           = "digitrans_db"
  username          = "digitrans_admin"
  password          = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.sg_rds_id]
  publicly_accessible    = false
  multi_az                = true
  backup_retention_period = 7
  backup_window           = "02:00-03:00"
  deletion_protection = var.environment == "prod" ? true : false
  skip_final_snapshot = var.environment == "prod" ? false : true
  tags = {
    Name       = "${var.project_name}-${var.environment}-postgres"
    DataClass  = "sensible"
    Compliance = "loi-camerounaise-2010-012"
  }
}

output "rds_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}
