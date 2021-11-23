mod utils;

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

use log::info;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Deserialize, Serialize, Debug)]
pub struct Game {
    id: String,
    ruleset: HashMap<String, Value>,
    timeout: u32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Board {
    height: u32,
    width: u32,
    food: Vec<Coord>,
    snakes: Vec<Battlesnake>,
    hazards: Vec<Coord>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Battlesnake {
    id: String,
    name: String,
    health: u32,
    body: Vec<Coord>,
    head: Coord,
    length: u32,
    latency: String,

    // Used in non-standard game modes
    shout: Option<String>,
    squad: Option<String>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Coord {
    x: u32,
    y: u32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GameState {
    game: Game,
    turn: u32,
    board: Board,
    you: Battlesnake,
}

#[wasm_bindgen]
pub fn get_info() -> JsValue {
    info!("INFO");

    return JsValue::from_serde(&json!({
        "apiversion": "1",
        "author": "icyJoseph",
        "color": "#888888",
        "head": "default",
        "tail": "default",
    }))
    .unwrap();
}
