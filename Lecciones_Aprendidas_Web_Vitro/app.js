/* ============================================================
   GESTIÓN DE CAMBIOS DE ESTÁNDARES
   Aplicación web - Versión 1.0
============================================================ */


let reuniones = JSON.parse(
    localStorage.getItem("reunionesEstandares")
) || [];


let fotosSeleccionadas = [];


/* ============================================================
   NAVEGACIÓN
============================================================ */

function mostrarSeccion(id, boton = null) {

    document.querySelectorAll(".section").forEach(section => {

        section.classList.remove("active-section");

    });


    const seccion = document.getElementById(id);

    if (seccion) {

        seccion.classList.add("active-section");

    }


    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.remove("active");

    });


    if (boton) {

        boton.classList.add("active");

    }


    const titulos = {

        inicio: "Dashboard",

        registro: "Nueva reunión",

        historial: "Historial"

    };


    document.getElementById("pageTitle").textContent =
        titulos[id] || "Gestión";


    if (id === "inicio") {

        actualizarDashboard();

    }


    if (id === "historial") {

        renderHistorial();

    }

}


function irARegistro() {

    const boton = document.querySelectorAll(".nav-item")[1];

    mostrarSeccion("registro", boton);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   PARTICIPANTES
============================================================ */

function agregarParticipante() {

    const container =
        document.getElementById("participantesContainer");


    const row = document.createElement("div");

    row.className = "participant-row";


    row.innerHTML = `

        <input
            type="text"
            placeholder="Nombre completo"
            class="participant-name"
        >

        <input
            type="text"
            placeholder="Cargo / Rol"
            class="participant-role"
        >

        <input
            type="text"
            placeholder="Área"
            class="participant-area"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="eliminarParticipante(this)"
        >
            ×
        </button>

    `;


    container.appendChild(row);

}


function eliminarParticipante(button) {

    const filas =
        document.querySelectorAll(".participant-row");


    if (filas.length <= 1) {

        return;

    }


    button.parentElement.remove();

}


/* ============================================================
   ACCIONES
============================================================ */

function agregarAccion() {

    const container =
        document.getElementById("accionesContainer");


    const row = document.createElement("div");

    row.className = "action-row";


    row.innerHTML = `

        <input
            type="text"
            placeholder="Acción / compromiso"
            class="action-description"
        >

        <input
            type="text"
            placeholder="Responsable"
            class="action-responsible"
        >

        <input
            type="date"
            class="action-date"
        >

        <select class="action-status">

            <option>Pendiente</option>

            <option>En proceso</option>

            <option>Cerrada</option>

        </select>

        <button
            type="button"
            class="remove-btn"
            onclick="eliminarAccion(this)"
        >
            ×
        </button>

    `;


    container.appendChild(row);

}


function eliminarAccion(button) {

    const filas =
        document.querySelectorAll(".action-row");


    if (filas.length <= 1) {

        return;

    }


    button.parentElement.remove();

}


/* ============================================================
   FOTOGRAFÍAS
============================================================ */

function mostrarFotos(event) {

    const archivos =
        Array.from(event.target.files);


    fotosSeleccionadas = [];


    archivos.forEach((archivo, index) => {

        const reader = new FileReader();


        reader.onload = function(e) {

            fotosSeleccionadas.push({

                nombre: archivo.name,

                datos: e.target.result

            });


            renderFotos();

        };


        reader.readAsDataURL(archivo);

    });

}


function renderFotos() {

    const container =
        document.getElementById("previewFotos");


    container.innerHTML = "";


    fotosSeleccionadas.forEach((foto, index) => {

        const div =
            document.createElement("div");


        div.className = "photo-item";


        div.innerHTML = `

            <img src="${foto.datos}">

            <button
                type="button"
                class="photo-remove"
                onclick="eliminarFoto(${index})"
            >
                ×
            </button>

        `;


        container.appendChild(div);

    });

}


function eliminarFoto(index) {

    fotosSeleccionadas.splice(index, 1);

    renderFotos();

}


/* ============================================================
   GUARDAR REUNIÓN
============================================================ */

document
    .getElementById("reunionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const participantes = [];


        document
            .querySelectorAll(".participant-row")
            .forEach(row => {

                const nombre =
                    row.querySelector(".participant-name").value.trim();

                const cargo =
                    row.querySelector(".participant-role").value.trim();

                const area =
                    row.querySelector(".participant-area").value.trim();


                if (nombre) {

                    participantes.push({

                        nombre,

                        cargo,

                        area

                    });

                }

            });


        const acciones = [];


        document
            .querySelectorAll(".action-row")
            .forEach(row => {

                const descripcion =
                    row.querySelector(".action-description").value.trim();

                const responsable =
                    row.querySelector(".action-responsible").value.trim();

                const fecha =
                    row.querySelector(".action-date").value;

                const estado =
                    row.querySelector(".action-status").value;


                if (descripcion) {

                    acciones.push({

                        descripcion,

                        responsable,

                        fecha,

                        estado

                    });

                }

            });


        const tipoCambio =
            document.querySelector(
                'input[name="tipoCambio"]:checked'
            );


        const nuevaReunion = {

            id: Date.now(),

            numero:
                "REU-" +
                String(reuniones.length + 1).padStart(4, "0"),


            fecha:
                document.getElementById("fecha").value,


            hora:
                document.getElementById("hora").value,


            grupo:
                document.getElementById("grupo").value,


            proceso:
                document.getElementById("proceso").value,


            lugar:
                document.getElementById("lugar").value,


            responsable:
                document.getElementById("responsable").value,


            participantes,


            codigoIT:
                document.getElementById("codigoIT").value,


            nombreIT:
                document.getElementById("nombreIT").value,


            versionAnterior:
                document.getElementById("versionAnterior").value,


            versionNueva:
                document.getElementById("versionNueva").value,


            tipoCambio:
                tipoCambio ? tipoCambio.value : "No especificado",


            descripcion:
                document.getElementById("descripcionCambio").value,


            motivo:
                document.getElementById("motivoCambio").value,


            acuerdos:
                document.getElementById("acuerdos").value,


            acciones,


            fotos:
                fotosSeleccionadas,


            creado:
                new Date().toISOString()

        };


        reuniones.push(nuevaReunion);


        guardarDatos();


        mostrarToast(
            "✓ Reunión registrada correctamente"
        );


        limpiarFormulario();


        setTimeout(() => {

            mostrarSeccion(
                "historial",
                document.querySelectorAll(".nav-item")[2]
            );

        }, 700);

});


/* ============================================================
   LOCAL STORAGE
============================================================ */

function guardarDatos() {

    localStorage.setItem(
        "reunionesEstandares",
        JSON.stringify(reuniones)
    );

}


/* ============================================================
   LIMPIAR FORMULARIO
============================================================ */

function limpiarFormulario() {

    document
        .getElementById("reunionForm")
        .reset();


    fotosSeleccionadas = [];


    document.getElementById(
        "previewFotos"
    ).innerHTML = "";


    const participantes =
        document.getElementById(
            "participantesContainer"
        );


    participantes.innerHTML = `

        <div class="participant-row">

            <input
                type="text"
                placeholder="Nombre completo"
                class="participant-name"
            >

            <input
                type="text"
                placeholder="Cargo / Rol"
                class="participant-role"
            >

            <input
                type="text"
                placeholder="Área"
                class="participant-area"
            >

            <button
                type="button"
                class="remove-btn"
                onclick="eliminarParticipante(this)"
            >
                ×
            </button>

        </div>

    `;


    const acciones =
        document.getElementById(
            "accionesContainer"
        );


    acciones.innerHTML = `

        <div class="action-row">

            <input
                type="text"
                placeholder="Acción / compromiso"
                class="action-description"
            >

            <input
                type="text"
                placeholder="Responsable"
                class="action-responsible"
            >

            <input
                type="date"
                class="action-date"
            >

            <select class="action-status">

                <option>Pendiente</option>

                <option>En proceso</option>

                <option>Cerrada</option>

            </select>

            <button
                type="button"
                class="remove-btn"
                onclick="eliminarAccion(this)"
            >
                ×
            </button>

        </div>

    `;

}


/* ============================================================
   DASHBOARD
============================================================ */

function actualizarDashboard() {

    document.getElementById(
        "totalReuniones"
    ).textContent = reuniones.length;


    const codigos =
        new Set(
            reuniones
                .map(r => r.codigoIT)
                .filter(Boolean)
        );


    document.getElementById(
        "totalIT"
    ).textContent = codigos.size;


    let pendientes = 0;

    let participantes = 0;


    reuniones.forEach(r => {

        participantes +=
            r.participantes.length;


        r.acciones.forEach(a => {

            if (
                a.estado === "Pendiente" ||
                a.estado === "En proceso"
            ) {

                pendientes++;

            }

        });

    });


    document.getElementById(
        "totalPendientes"
    ).textContent = pendientes;


    document.getElementById(
        "totalParticipantes"
    ).textContent = participantes;


    renderGraficoMeses();

    renderTiposCambio();

    renderEstadosAcciones();

    renderUltimasReuniones();

}


/* ============================================================
   GRÁFICO POR MES
============================================================ */

function renderGraficoMeses() {

    const container =
        document.getElementById(
            "graficoMeses"
        );


    container.innerHTML = "";


    const meses = [

        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"

    ];


    const valores =
        new Array(12).fill(0);


    reuniones.forEach(r => {

        if (!r.fecha) return;


        const mes =
            new Date(
                r.fecha + "T00:00:00"
            ).getMonth();


        valores[mes]++;

    });


    const max =
        Math.max(...valores, 1);


    meses.forEach((mes, index) => {

        const item =
            document.createElement("div");


        item.className =
            "bar-item";


        const altura =
            (valores[index] / max) * 180;


        item.innerHTML = `

            <div class="bar-value">
                ${valores[index]}
            </div>

            <div
                class="bar"
                style="height:${Math.max(
                    altura,
                    valores[index] ? 8 : 3
                )}px"
            ></div>

            <div class="bar-label">
                ${mes}
            </div>

        `;


        container.appendChild(item);

    });

}


/* ============================================================
   TIPOS DE CAMBIO
============================================================ */

function renderTiposCambio() {

    const container =
        document.getElementById(
            "tipoCambios"
        );


    container.innerHTML = "";


    const conteo = {};


    reuniones.forEach(r => {

        const tipo =
            r.tipoCambio || "No especificado";


        conteo[tipo] =
            (conteo[tipo] || 0) + 1;

    });


    const total =
        reuniones.length || 1;


    Object.entries(conteo)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 7)
        .forEach(([tipo, cantidad]) => {

            const porcentaje =
                Math.round(
                    cantidad / total * 100
                );


            const div =
                document.createElement("div");


            div.className =
                "stat-line";


            div.innerHTML = `

                <div class="stat-line-top">

                    <span>
                        ${tipo}
                    </span>

                    <strong>
                        ${cantidad}
                    </strong>

                </div>

                <div class="progress">

                    <span
                        style="width:${porcentaje}%"
                    ></span>

                </div>

            `;


            container.appendChild(div);

        });


    if (!Object.keys(conteo).length) {

        container.innerHTML =
            "<p style='color:#71808f;font-size:12px'>Sin registros todavía.</p>";

    }

}


/* ============================================================
   ESTADOS
============================================================ */

function renderEstadosAcciones() {

    const container =
        document.getElementById(
            "estadosAcciones"
        );


    container.innerHTML = "";


    const estados = {

        "Pendiente": 0,

        "En proceso": 0,

        "Cerrada": 0

    };


    reuniones.forEach(r => {

        r.acciones.forEach(a => {

            if (estados[a.estado] !== undefined) {

                estados[a.estado]++;

            }

        });

    });


    const total =
        Object.values(estados)
            .reduce((a,b) => a+b, 0) || 1;


    Object.entries(estados)
        .forEach(([estado, cantidad]) => {

            const porcentaje =
                Math.round(
                    cantidad / total * 100
                );


            const div =
                document.createElement("div");


            div.className =
                "stat-line";


            div.innerHTML = `

                <div class="stat-line-top">

                    <span>
                        ${estado}
                    </span>

                    <strong>
                        ${cantidad}
                    </strong>

                </div>

                <div class="progress">

                    <span
                        style="width:${porcentaje}%"
                    ></span>

                </div>

            `;


            container.appendChild(div);

        });

}


/* ============================================================
   ÚLTIMAS REUNIONES
============================================================ */

function renderUltimasReuniones() {

    const tbody =
        document.getElementById(
            "ultimasReuniones"
        );


    tbody.innerHTML = "";


    reuniones
        .slice()
        .sort(
            (a,b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        )
        .slice(0, 5)
        .forEach(r => {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${formatearFecha(r.fecha)}
                </td>

                <td>
                    ${r.grupo}
                </td>

                <td>
                    <strong>
                        ${r.codigoIT}
                    </strong>
                </td>

                <td>
                    ${r.tipoCambio}
                </td>

                <td>
                    <span class="status proceso">
                        Registrada
                    </span>
                </td>

            `;


            tbody.appendChild(tr);

        });


    if (!reuniones.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;color:#71808f"
                >
                    No existen reuniones registradas.
                </td>

            </tr>

        `;

    }

}


/* ============================================================
   HISTORIAL
============================================================ */

function renderHistorial() {

    const tbody =
        document.getElementById(
            "historialTabla"
        );


    const busqueda =
        document.getElementById(
            "busqueda"
        ).value
        .toLowerCase()
        .trim();


    tbody.innerHTML = "";


    const filtradas =
        reuniones.filter(r => {

            const texto = (

                r.codigoIT +
                " " +
                r.nombreIT +
                " " +
                r.grupo +
                " " +
                r.tipoCambio +
                " " +
                r.participantes
                    .map(p => p.nombre)
                    .join(" ")

            ).toLowerCase();


            return texto.includes(busqueda);

        });


    filtradas
        .sort(
            (a,b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        )
        .forEach(r => {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${formatearFecha(r.fecha)}
                </td>

                <td>
                    ${r.grupo}
                </td>

                <td>
                    <strong>
                        ${r.codigoIT}
                    </strong>
                </td>

                <td>
                    ${r.nombreIT}
                </td>

                <td>
                    ${r.tipoCambio}
                </td>

                <td>
                    ${r.participantes.length}
                </td>

                <td>
                    📷 ${r.fotos.length}
                </td>

                <td>

                    <button
                        class="table-action"
                        onclick="verDetalle(${r.id})"
                    >
                        Ver
                    </button>

                    <button
                        class="table-action"
                        onclick="eliminarReunion(${r.id})"
                    >
                        Eliminar
                    </button>

                </td>

            `;


            tbody.appendChild(tr);

        });


    if (!filtradas.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:30px;color:#71808f"
                >
                    No se encontraron registros.
                </td>

            </tr>

        `;

    }

}


/* ============================================================
   DETALLE
============================================================ */

function verDetalle(id) {

    const reunion =
        reuniones.find(
            r => r.id === id
        );


    if (!reunion) return;


    const modalBody =
        document.getElementById(
            "modalBody"
        );


    const participantes =
        reunion.participantes
            .map(
                p =>
                    `<li>
                        <strong>${p.nombre}</strong>
                        — ${p.cargo || "Sin cargo"}
                        ${p.area ? " | " + p.area : ""}
                    </li>`
            )
            .join("");


    const acciones =
        reunion.acciones
            .map(
                a =>
                    `<tr>
                        <td>${a.descripcion}</td>
                        <td>${a.responsable}</td>
                        <td>${a.fecha || "-"}</td>
                        <td>${a.estado}</td>
                    </tr>`
            )
            .join("");


    const fotos =
        reunion.fotos
            .map(
                f =>
                    `<img
                        src="${f.datos}"
                        style="
                            width:150px;
                            height:110px;
                            object-fit:cover;
                            border-radius:8px;
                        "
                    >`
            )
            .join("");


    modalBody.innerHTML = `

        <p class="eyebrow">
            ${reunion.numero}
        </p>

        <h2 style="margin-top:5px">
            ${reunion.nombreIT}
        </h2>

        <p style="color:#71808f;font-size:12px">
            ${reunion.codigoIT}
        </p>


        <hr style="border:0;border-top:1px solid #e2e8ee;margin:20px 0">


        <div class="form-grid">

            <div>
                <strong>Fecha</strong>
                <p>${formatearFecha(reunion.fecha)}</p>
            </div>

            <div>
                <strong>Hora</strong>
                <p>${reunion.hora}</p>
            </div>

            <div>
                <strong>Grupo</strong>
                <p>${reunion.grupo}</p>
            </div>

            <div>
                <strong>Proceso</strong>
                <p>${reunion.proceso}</p>
            </div>

            <div>
                <strong>Versión anterior</strong>
                <p>${reunion.versionAnterior || "-"}</p>
            </div>

            <div>
                <strong>Nueva versión</strong>
                <p>${reunion.versionNueva || "-"}</p>
            </div>

        </div>


        <h3>Clasificación</h3>

        <p>
            <span class="status proceso">
                ${reunion.tipoCambio}
            </span>
        </p>


        <h3>Participantes</h3>

        <ul>
            ${participantes || "<li>Sin participantes registrados</li>"}
        </ul>


        <h3>Descripción del cambio</h3>

        <p>
            ${reunion.descripcion || "-"}
        </p>


        <h3>Motivo</h3>

        <p>
            ${reunion.motivo || "-"}
        </p>


        <h3>Acuerdos</h3>

        <p>
            ${reunion.acuerdos || "-"}
        </p>


        <h3>Acciones</h3>

        <div class="table-container">

            <table>

                <thead>

                    <tr>
                        <th>Acción</th>
                        <th>Responsable</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>

                </thead>

                <tbody>

                    ${acciones || `
                        <tr>
                            <td colspan="4">
                                No hay acciones registradas.
                            </td>
                        </tr>
                    `}

                </tbody>

            </table>

        </div>


        <h3 style="margin-top:25px">
            Evidencia fotográfica
        </h3>


        <div
            style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            "
        >

            ${fotos || "<p>No hay fotografías.</p>"}

        </div>

    `;


    document
        .getElementById("modal")
        .classList.add("show");

}


function cerrarModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


window.onclick = function(event) {

    const modal =
        document.getElementById("modal");


    if (event.target === modal) {

        cerrarModal();

    }

};


/* ============================================================
   ELIMINAR REUNIÓN
============================================================ */

function eliminarReunion(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este registro?"
        );


    if (!confirmar) return;


    reuniones =
        reuniones.filter(
            r => r.id !== id
        );


    guardarDatos();

    renderHistorial();

    actualizarDashboard();

    mostrarToast(
        "Registro eliminado"
    );

}


/* ============================================================
   UTILIDADES
============================================================ */

function formatearFecha(fecha) {

    if (!fecha) return "-";


    const d =
        new Date(
            fecha + "T00:00:00"
        );


    return d.toLocaleDateString(
        "es-CO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


function mostrarToast(mensaje) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        mensaje;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ============================================================
   INICIALIZAR
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarDashboard();

        const hoy =
            new Date()
                .toISOString()
                .split("T")[0];


        document.getElementById(
            "fecha"
        ).value = hoy;

    }
);