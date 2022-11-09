const form = document.getElementById('actualizacion');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = {
        title: document.getElementById('title').value,
        price: parseInt(document.getElementById('price').value),
        thumbnail: document.getElementById('image').value,
    }

    fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => console.log(data));

});