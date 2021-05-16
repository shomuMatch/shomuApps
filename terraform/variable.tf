locals {
  project_name = "shomuapps"

  vpc_cidr = "10.0.0.0/16"

}

locals {
  s3_origin_id = "s3_origin_id_for_${local.project_name}_frontend"
}

locals {
  root_domain = "shomuapps.com"
}