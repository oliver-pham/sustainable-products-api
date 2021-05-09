require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function emailTemplate(category, products) {
    let body = `<h1>${category}</h1><ol>`;
    if (products.length > 0) {
        let list = products.reduce((productList, product) => {
          return (
            productList +
            `
            <li>
                <p>Brand Name: ${product.brand_name}</p>
                <p>Model Name: ${product.model_name}</p>
            </li>
        `
          );
        }, "");

        return body + list + "</ol>";
    }
    else return body + "</ol>";
}


function notify(destination, suggestions) {
    var template = "";

    if (suggestions.length > 0) {
        template = suggestions.reduce(
          (content, suggestion) => {
              return (
                content +
                emailTemplate(suggestion.category, suggestion.products)
              );
          },
          ""
        );
    }
    
    const msg = {
      to: destination,
      from: process.env.SENDGRID_SENDER,
      subject: "Ecologico: Sustainable Product Recommendations",
      html: template,
    };

    sgMail.send(msg).then(
      () => {},
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
}

module.exports = notify;