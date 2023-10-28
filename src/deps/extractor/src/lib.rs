use scraper::{Html, Selector};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Extractor {
    document: Html,
}

#[wasm_bindgen]
impl Extractor {
    pub fn new(html: &str) -> Extractor {
        Extractor {
            document: Html::parse_document(html),
        }
    }
    pub fn query(&self, selector_str: &str) -> Option<String> {
        let selector = Selector::parse(selector_str).ok()?;
        let mut selects = self.document.select(&selector);
        let one_sel = selects.next()?;
        let s = one_sel.text().collect::<String>();
        Some(s)
    }
    pub fn query_all_count(&self, selector_str: &str) -> Option<u32> {
        let selector = Selector::parse(selector_str).ok()?;
        let mut selects = self.document.select(&selector);
        Some(selects.count() as u32)
    }
}
