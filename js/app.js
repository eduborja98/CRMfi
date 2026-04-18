// Variables
let qrCodeInstance = null;

// DOM Elements
const form = document.getElementById('memberForm');
const btnReset = document.getElementById('btnReset');

const inputs = {
    correo: document.getElementById('correo'),
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    telefono: document.getElementById('telefono'),
    frecuencia: document.getElementById('frecuencia'),
};

const tierCard = document.getElementById('tierCard');
const tierNameEl = document.getElementById('tierName');
const tierIconEl = document.getElementById('tierIcon');
const displayNombre = document.getElementById('displayNombre');
const displayFrecuencia = document.getElementById('displayFrecuencia');
const qrContainerDOM = document.getElementById('qrcode');
const qrHelpText = document.getElementById('qrHelpText');

// Utility to normalize keys (removing accents and making lowercase, remove spaces)
const normalizeKey = (key) => {
    return key.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, "_");
};

// ==========================================
// 3. FORM SUBMISSION (QR & TIER ASSIGNMENT)
// ==========================================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const freqStr = inputs.frecuencia.value.trim().toLowerCase();
    
    // Determine level
    // diario -> black
    // semanal -> platinum
    // quincenal -> zafir
    // mensual / ocasional -> gold
    let tierClassEl = "";
    let tierLabel = "";
    let iconClass = "";

    if (freqStr.includes("diari") || freqStr.includes("siempre")) {
        tierClassEl = "tier-black";
        tierLabel = "BLACK";
        iconClass = "fa-gem";
    } else if (freqStr.includes("semanal")) {
        tierClassEl = "tier-platinum";
        tierLabel = "PLATINUM";
        iconClass = "fa-star";
    } else if (freqStr.includes("quincenal")) {
        tierClassEl = "tier-zafir";
        tierLabel = "ZAFIR";
        iconClass = "fa-diamond";
    } else {
        // Mensual, Ocasional, u otra... default fall back to GOLD
        tierClassEl = "tier-gold";
        tierLabel = "GOLD";
        iconClass = "fa-crown";
    }

    // Update UI Card
    tierCard.className = `tier-card ${tierClassEl} pop-in`;
    tierNameEl.innerText = tierLabel;
    tierIconEl.className = `fa-solid ${iconClass}`;
    
    const fullName = `${inputs.nombre.value} ${inputs.apellido.value}`.trim() || inputs.correo.value;
    displayNombre.innerText = fullName;
    displayFrecuencia.innerText = `Frecuencia: ${freqStr.toUpperCase()} - Nivel de acceso otorgado.`;

    // Generate QR Content
    const qrData = {
        name: fullName,
        email: inputs.correo.value,
        phone: inputs.telefono.value,
        tier: tierLabel,
        frequency: freqStr
    };

    const qrString = JSON.stringify(qrData);

    // Render QR Code
    qrHelpText.classList.add('hidden');
    qrContainerDOM.innerHTML = ""; // clear previous

    qrCodeInstance = new QRCode(qrContainerDOM, {
        text: qrString,
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    btnReset.classList.remove('hidden');

    Swal.fire({
        title: '¡Acceso VIP Generado!',
        text: `Se ha asignado el Club ${tierLabel} y se generó el código QR correctamente.`,
        icon: 'success',
        background: '#1f1f1f',
        color: '#fff',
        confirmButtonColor: '#d4af37'
    });

    // Envío simulado / Apertura de cliente de correo
    setTimeout(() => {
        const bodyContent = `Hola ${fullName}, bienvenido al Casino Rio.\n\nSegún tu frecuencia (${freqStr}), has sido asignado al nivel de Club ${tierLabel}.\n\nMuestra tu código QR en la entrada para acceder a tus beneficios.`;
        
        // Simulación visual en UI
        Swal.fire({
            title: 'Confirmación Enviada',
            text: `Se ha enviado el nivel de adaptación al correo: ${inputs.correo.value}`,
            icon: 'info',
            background: '#1f1f1f',
            color: '#fff',
            confirmButtonColor: '#d4af37',
            toast: true,
            position: 'top-end',
            timer: 4000,
            showConfirmButton: false
        });

        // Abre el cliente de correo predeterminado del usuario con los datos listos
        window.location.href = `mailto:${inputs.correo.value}?subject=Confirmación de Registro VIP Casino Rio&body=${encodeURIComponent(bodyContent)}`;
    }, 1500);
});

// ==========================================
// 4. RESET
// ==========================================
btnReset.addEventListener('click', () => {
    form.reset();
    currentSearchedUser = null;
    
    tierCard.className = `tier-card empty`;
    tierNameEl.innerText = "SIN CLASIFICAR";
    tierIconEl.className = `fa-solid fa-user-xmark`;
    displayNombre.innerText = "-----";
    displayFrecuencia.innerText = "Esperando registro...";
    
    qrContainerDOM.innerHTML = "";
    qrHelpText.classList.remove('hidden');
    btnReset.classList.add('hidden');
    
    inputs.correo.focus();
});
