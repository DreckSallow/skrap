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

        match one_sel.value().name() {
            //If the element is an image element, then get it src.
            "img" => one_sel.value().attr("src").to_owned().map(|s| s.to_owned()),
            "a" => one_sel
                .value()
                .attr("href")
                .to_owned()
                .map(|s| s.to_owned()),
            _ => {
                let s = one_sel.text().collect::<String>();
                Some(s)
            }
        }
    }
    pub fn query_all_count(&self, selector_str: &str) -> Option<u32> {
        let selector = Selector::parse(selector_str).ok()?;
        Some(self.document.select(&selector).count() as u32)
    }
}

#[cfg(test)]
mod tests {
    use scraper::{Html, Selector};

    use crate::Extractor;

    #[test]
    fn test_tag_name() {
        let html = r#"
            <!DOCTYPE html>
            <meta charset="utf-8">
            <title>Hello, world!</title>
            <body>
                <h1 class="foo">Hello, <i>world!</i></h1>
                <p class="text">Example text</p>
                <NEW>New Text</NEW>
            </body>
        "#;

        let document = Html::parse_document(html);
        let selectors = ["h1.foo", "p.text", "NEW"];
        let texts = ["Hello, world!", "Example text", "New Text"];
        let tag_names = ["h1", "p", "new"]; // The names must be in lowercase.
        for (i, sel) in selectors.iter().enumerate() {
            let selector = Selector::parse(sel).unwrap();
            let element = document.select(&selector).next().unwrap();
            assert_eq!(element.text().collect::<String>(), texts[i]);
            let val = element.value();
            assert_eq!(val.name(), tag_names[i]);
        }
    }

    #[test]
    fn test_query_content() {
        let html = r#"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Two Images Example</title>
            </head>
            <body>
                <h1>Two Images</h1>
                <img src="https://source.unsplash.com/200x150/?nature" alt="Image 1" width="200" height="150" class="image"/>
                <img src="https://picsum.photos/id/237/200/300" alt="Image 2" width="200" height="150" id="second_img"/>
                <a href="/login" class="link"/>
            </body>
            </html>
        "#;
        let extractor = Extractor::new(html);
        let title_text = extractor.query("h1").unwrap();
        assert_eq!(title_text, "Two Images");

        let second_img = extractor.query("#second_img").unwrap();
        assert_eq!(second_img, "https://picsum.photos/id/237/200/300");

        let first_img = extractor.query("img.image").unwrap();
        assert_eq!(first_img, "https://source.unsplash.com/200x150/?nature");

        let link = extractor.query("a.link").unwrap();
        assert_eq!(link, "/login");
    }
}
