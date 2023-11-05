use std::collections::HashMap;

use gloo_utils::format::JsValueSerdeExt;
use scraper::{ElementRef, Html, Selector};
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
    fn get_element_content<'a>(el: ElementRef<'a>) -> Option<String> {
        match el.value().name() {
            //If the element is an image element, then get it src.
            "img" => el.value().attr("src").to_owned().map(|s| s.to_owned()),
            "a" => el.value().attr("href").to_owned().map(|s| s.to_owned()),
            _ => {
                let s = el.text().collect::<String>();
                Some(s)
            }
        }
    }
    pub fn query(&self, selector_str: &str) -> Option<String> {
        let selector = Selector::parse(selector_str).ok()?;
        let mut selects = self.document.select(&selector);
        let one_sel = selects.next()?;
        Extractor::get_element_content(one_sel)
    }
    pub fn query_all(&self, parent_sel: &str, obj_selectors: JsValue) -> JsValue {
        let selector = match Selector::parse(parent_sel) {
            Ok(s) => s,
            Err(_) => return JsValue::NULL,
        };
        let selectors: HashMap<String, String> = match obj_selectors.into_serde() {
            Ok(v) => v,
            Err(_) => return JsValue::NULL,
        };
        let selects = self.document.select(&selector);

        let mut list = Vec::new();

        for parent_el in selects {
            let mut group_data = HashMap::new();
            for (key, sel) in &selectors {
                let parsed_sel = Selector::parse(&sel);
                match parsed_sel {
                    Ok(ref s) => match parent_el.select(s).next() {
                        Some(el) => group_data.insert(key, Extractor::get_element_content(el)),
                        None => group_data.insert(key, None),
                    },
                    Err(_) => group_data.insert(key, None),
                };
            }
            list.push(group_data);
        }
        JsValue::from_serde(&list).unwrap()
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

    // #[test]
    // fn test_query_all() {
    //     let html = r#"
    //         <!DOCTYPE html>
    //         <html>
    //         <head>
    //             <title>Sample E-commerce</title>
    //         </head>
    //         <body>
    //             <header>
    //                 <h1>Welcome to our E-commerce Store</h1>
    //             </header>

    //             <section class="product-list">
    //                 <div class="product">
    //                     <img src="product1.jpg" alt="Product 1">
    //                     <h2>Product 1</h2>
    //                     <p>Price: $19.99</p>
    //                     <button>Add to Cart</button>
    //                 </div>

    //                 <div class="product">
    //                     <img src="product2.jpg" alt="Product 2">
    //                     <h2>Product 2</h2>
    //                     <p>Price: $29.99</p>
    //                     <button>Add to Cart</button>
    //                 </div>

    //                 <div class="product">
    //                     <img src="product3.jpg" alt="Product 3">
    //                     <h2>Product 3</h2>
    //                     <p>Price: $39.99</p>
    //                     <button>Add to Cart</button>
    //                 </div>

    //                 <div class="product">
    //                     <img src="product4.jpg" alt="Product 4">
    //                     <h2>Product 4</h2>
    //                     <p>Price: $49.99</p>
    //                     <button>Add to Cart</button>
    //                 </div>
    //             </section>

    //             <footer>
    //                 <p>&copy; 2023 Sample E-commerce Store</p>
    //             </footer>
    //         </body>
    //         </html>
    //     "#;

    //     let extractor = Extractor::new(html);
    //     let val = HashMap::from([("image", "img"), ("title", "h2"), ("price", "p")]);
    //     extractor.query_all(
    //         "section.product-list > div.product",
    //         JsValue::from_serde(&val).unwrap(),
    //     );
    // }
}
