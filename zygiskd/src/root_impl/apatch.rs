use std::process::{Command, Stdio};
use std::fs::File;
use serde::Deserialize;
use crate::constants::MIN_APATCH_VERSION;

pub enum Version {
    Supported,
    TooOld,
    Abnormal,
}
fn parse_version(output: &str) -> i32 {
    let mut version: Option<i32> = None;
    for line in output.lines() {
        if let Some(num) = line.trim().split_whitespace().last() {
            if let Ok(v) = num.parse::<i32>() {
                version = Some(v);
                break;
            }
        }
    }
    version.unwrap_or_default()
}

pub fn get_apatch() -> Option<Version> {
    let output1 = Command::new("/data/adb/apd")
        .arg("-V")
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .output()
        .ok()?;
    let stdout1 = String::from_utf8(output1.stdout).ok()?;
    let version = parse_version(&stdout1);
    const MAX_OLD_VERSION: i32 = MIN_APATCH_VERSION - 1;
    match version {
        0 => Some(Version::Abnormal),
        v if v >= MIN_APATCH_VERSION && v <= 999999 => Some(Version::Supported),
        v if v >= 1 && v <= MAX_OLD_VERSION => Some(Version::TooOld),
        _ => None,
    }
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct PackageConfig {
    pkg: String,
    exclude: i32,
    allow: i32,
    uid: i32,
    to_uid: i32,
    sctx: String,
}

fn read_package_config() -> Result<Vec<PackageConfig>, std::io::Error> {
    let file = File::open("/data/adb/ap/package_config")?;
    let mut reader = csv::Reader::from_reader(file);

    let mut package_configs = Vec::new();
    for record in reader.deserialize() {
        match record {
            Ok(config) => package_configs.push(config),
            Err(error) => {
                log::warn!("Error deserializing record: {}", error);
            }
        }
    }

    Ok(package_configs)
}

pub fn uid_granted_root(uid: i32) -> bool {
    match read_package_config() {
        Ok(package_configs) => {
            package_configs
                .iter()
                .find(|config| config.uid == uid)
                .map(|config| config.allow == 1)
                .unwrap_or(false)
        }
        Err(err) => {
            log::warn!("Error reading package config: {}", err);
            return false;
        }
    }
}

pub fn uid_should_umount(uid: i32) -> bool {
    match read_package_config() {
        Ok(package_configs) => {
            package_configs
                .iter()
                .find(|config| config.uid == uid)
                .map(|config| {
                    match config.exclude {
                        1 => true,
                        _ => false,
                    }
                })
                .unwrap_or(false)
        }
        Err(err) => {
            log::warn!("Error reading package configs: {}", err);
            false
        }
    }
}

// TODO: signature
pub fn uid_is_manager(uid: i32) -> bool {
    if let Ok(s) = rustix::fs::stat("/data/user_de/0/me.bmax.apatch") {
        return s.st_uid == uid as u32;
    }
    false
}