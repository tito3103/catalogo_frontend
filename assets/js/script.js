// Configuración base de axios
const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Variables globales
let editando = false;
let productoId = null;

// Función para cargar productos
async function cargarProductos() {
    try {
        const response = await api.get('/productos');
        mostrarProductos(response.data);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
    }
}

// Función para mostrar productos
function mostrarProductos(productos) {
    const catalogoDiv = document.querySelector('.catalogo');
    catalogoDiv.innerHTML = '';

    productos.forEach(producto => {
        catalogoDiv.innerHTML += `
            <div class="producto" style="width: 310px; height: 400px;">
                <img src="${producto.imagen}" alt="${producto.name}" style="width: 200px; height: 200px;">
                <h3>${producto.name}</h3>
                <p>Descripcion: ${producto.description} </p>
                <div class="precio">$${producto.price}</div>
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    // Actualizar tabla
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    productos.forEach(producto => {
        tbody.innerHTML += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.name}</td>
                <td>${producto.description}</td>
                <td>$${producto.price}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Función para editar producto
async function editarProducto(id) {
    try {
        // Verificar que el ID sea válido
        console.log('ID del producto a editar:', id);
        
        // Imprimir la URL completa que se está intentando acceder
        const url = `/productos/${id}`;
        console.log('Intentando acceder a:', api.defaults.baseURL + url);
        
        const response = await api.get(url);
        
        // Si llegamos aquí, la petición fue exitosa
        console.log('Datos del producto:', response.data);
        
        const producto = response.data;
        productoId = id;
        editando = true;

        // Llenar el formulario
        document.getElementById('nombre').value = producto.name;
        document.getElementById('description').value = producto.description;
        document.getElementById('price').value = producto.price;
        document.getElementById('imagen').value = producto.imagen;

        document.getElementById('productoModalLabel').textContent = 'Editar Producto';

        const modalElement = document.getElementById('productoModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } catch (error) {
        console.error('Error completo:', error);
        console.error('Detalles de la respuesta:', error.response);
        alert('Error al cargar el producto: ' + (error.response?.data?.message || error.message));
    }
}

// Función para manejar el envío del formulario
async function manejarFormulario(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('nombre').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        imagen: document.getElementById('imagen').value
    };

    try {
        if (editando) {
            await api.put(`/productos/${productoId}`, formData);
            alert('Producto actualizado exitosamente');
        } else {
            await api.post('/productos', formData);
            alert('Producto creado exitosamente');
        }

        // Cerrar modal y recargar productos
        const modal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
        modal.hide();
        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la operación');
    }
}

// Función para eliminar producto
async function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            await api.delete(`/productos/${id}`);
            alert('Producto eliminado con éxito');
            await cargarProductos(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto');
        }
    }
}

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
}

// Hacer la función disponible globalmente
window.limpiarFormulario = limpiarFormulario;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    document.getElementById('productoForm').addEventListener('submit', manejarFormulario);
});

// Función para abrir el modal de nuevo producto
function abrirModalNuevoProducto() {
    // Limpiar el formulario
    document.getElementById('productoForm').reset();
    // Eliminar el ID del producto (en caso de que hubiera uno)
    document.getElementById('productoId').value = '';
    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

// Hacer las funciones disponibles globalmente
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;