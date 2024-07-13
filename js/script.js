document.getElementById('calcularBoton').addEventListener('click', calcularPrestamo);
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    
    const img = document.createElement('img');
    img.src = 'imagen.jpg'; 
    img.alt = 'Logo página';

    const title = document.createElement('h1');
    title.textContent = 'BANCO CREDICOP';

    header.appendChild(img);
    header.appendChild(title);
});

async function obtenerConfigDesdeJSON() {
    try {
        const response = await fetch('./config.json');
        const data = await response.json();

        const configPrestamo = data[0]; 
        document.getElementById('montoPrestamo').value = configPrestamo.montoPrestamo;
        document.getElementById('interesAnual').value = configPrestamo.interesAnual;
        document.getElementById('cantidadCuotas').value = configPrestamo.cantidadCuotas;

    } catch (error) {
        Swal.fire('Error', 'No se pudo cargar la configuración desde el JSON.', 'error');
    }
}

function calcularPrestamo() {
    const montoPrestamo = parseFloat(document.getElementById('montoPrestamo').value);
    const interesAnual = parseFloat(document.getElementById('interesAnual').value) / 100;
    const cantidadCuotas = parseInt(document.getElementById('cantidadCuotas').value);
    if (isNaN(montoPrestamo) || montoPrestamo <= 0) {
        Swal.fire('Error', 'Rellene este campo.', 'error');
        return;
    }
    if (isNaN(interesAnual) || interesAnual < 0) {
        Swal.fire('Error', 'Rellene este campo.', 'error');
        return;
    }
    if (isNaN(cantidadCuotas) || cantidadCuotas <= 0) {
        Swal.fire('Error', 'Rellene este campo.', 'error');
        return;
    }

    const interesMensual = interesAnual / 12;
    const numeroDeCuotas = cantidadCuotas;

    const pagoMensual = (montoPrestamo * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroDeCuotas));
    const pagoTotal = pagoMensual * numeroDeCuotas;

    document.getElementById('pagoMensual').innerText = `Pago mensual: $${pagoMensual.toFixed(2)}`;
    document.getElementById('pagoTotal').innerText = `Monto total pagado: $${pagoTotal.toFixed(2)}`;

    document.getElementById('result').style.display = 'block';

    Swal.fire({
        title: 'Cálculo realizado',
        text: `Pago mensual: $${pagoMensual.toFixed(2)}\nMonto total pagado: $${pagoTotal.toFixed(2)}`,
        icon: 'info'
    });

    const configPrestamo = {
        montoPrestamo: montoPrestamo,
        interesAnual: interesAnual * 100,
        cantidadCuotas: cantidadCuotas
    };
    localStorage.setItem('configPrestamo', JSON.stringify(configPrestamo));
}
obtenerConfigDesdeJSON();


