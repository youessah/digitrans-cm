resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-redis-subnets"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "${var.project_name}-${var.environment}-redis-subnets" }
}

resource "aws_security_group" "redis" {
  name   = "${var.project_name}-${var.environment}-sg-redis"
  vpc_id = var.vpc_id
  ingress { from_port = 6379; to_port = 6379; protocol = "tcp"; cidr_blocks = ["10.0.0.0/16"] }
  egress  { from_port = 0;    to_port = 0;    protocol = "-1";  cidr_blocks = ["0.0.0.0/0"] }
  tags = { Name = "${var.project_name}-${var.environment}-sg-redis" }
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "${var.project_name}-${var.environment}-redis"
  description                = "Cache Redis offline-first DIGITRANS-CM"
  engine                     = "redis"
  engine_version             = "7.0"
  node_type                  = "cache.t3.micro"
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [aws_security_group.redis.id]
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  snapshot_retention_limit   = 1
  snapshot_window            = "03:00-04:00"
  maintenance_window         = "sun:04:00-sun:05:00"
  tags = { Name = "${var.project_name}-${var.environment}-redis" }
}

output "redis_primary_endpoint" {
  value     = aws_elasticache_replication_group.main.primary_endpoint_address
  sensitive = true
}
output "redis_reader_endpoint" {
  value     = aws_elasticache_replication_group.main.reader_endpoint_address
  sensitive = true
}
output "redis_port" { value = 6379 }
