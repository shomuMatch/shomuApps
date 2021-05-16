resource "aws_vpc" "vpc" {
  cidr_block = local.vpc_cidr

  tags = {
    Name    = local.project_name
    Project = local.project_name
  }
}