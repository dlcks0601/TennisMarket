const fs = require('fs');
const main_view = fs.readFileSync('./main.html');
const orderlist_view = fs.readFileSync('./orderlist.html');

const mariadb = require('./database/connect/mariadb');

function main(response) {
  console.log('main');

  mariadb.query('SELECT * FROM product', function (err, rows) {
    console.log(rows);
  });

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(main_view);
  response.end();
}

function redRacket(response) {
  fs.readFile('./img/redRacket.png', function (err, data) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(data);
    response.end();
  });
}

function blueRacket(response) {
  fs.readFile('./img/blueRacket.png', function (err, data) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(data);
    response.end();
  });
}

function blackRacket(response) {
  fs.readFile('./img/blackRacket.png', function (err, data) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(data);
    response.end();
  });
}

function order(response, productId) {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  mariadb.query(
    'INSERT INTO orderlist VALUES (' +
      productId +
      ", '" +
      new Date().toLocaleDateString() +
      "');",
    function (err, rows) {
      console.log(rows);
    }
  );

  response.write(
    'Thank you for your order! <br> you can check the result on the order list page.'
  );
  response.end();
}

function orderlist(response) {
  console.log('orderlist');
  response.writeHead(200, { 'Content-Type': 'text/html' });
  mariadb.query('SELECT * FROM orderlist', function (err, rows) {
    response.write(orderlist_view);

    rows.forEach((element) => {
      response.write(
        '<tr>' +
          '<td>' +
          element.product_id +
          '</td>' +
          '<td>' +
          element.order_date +
          '</td>' +
          '</tr>'
      );
    });

    response.write('</table>');
    response.end();
  });
}

/** CSS handler */
function serveCss(response) {
  fs.readFile('./main.css', function (err, data) {
    if (err) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('404 Not Found');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/css' });
      response.write(data);
    }
    response.end();
  });
}

let handle = {}; //key:value
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist.html'] = orderlist;

/** image directory */
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;

/** CSS file handler */
handle['/main.css'] = serveCss;

exports.handle = handle;
