const spanish = {
  messages: {
    greet: "Hola",
    auth: {
      login: {
        title: "Iniciar sesión en tu cuenta",
        subtitle:
          "¡Bienvenido de nuevo! Selecciona un método para iniciar sesión:",
        noAccount: "¿No tienes una cuenta?",
        signUp: "Regístrate",
        terms: "Términos y Condiciones",
        privacy: "Política de Privacidad",
      },
      register: {
        title: "Crea tu cuenta",
        subtitle: "Únete y empieza a usar {appName}.",
        haveAccount: "¿Ya tienes una cuenta?",
        signIn: "Inicia sesión",
        acceptTerms: "Acepto los {terms} y la {privacy}.",
        acceptTermsStart: "He leído y acepto los",
        acceptTermsMiddle: "y la",
        acceptTermsEnd: ".",
      },
    },
    login: {
      title: "Iniciar sesión en tu cuenta",
      subtitle:
        "¡Bienvenido de nuevo! Selecciona un método para iniciar sesión:",
      or: "O inicia sesión con",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Regístrate",
      signInButton: "Iniciar sesión →",
      privacy: "Política de Privacidad",
      support: "Soporte",
      footer: "© 2025 Huoon · {privacy} · {support}",

      fields: {
        name: "Nombre",
        email: "Correo electrónico",
        password: "Contraseña",
        user: "Usuario",
      },

      placeholders: {
        name: "Nombre",
        email: "johndoe@mail.com",
        password: "contraseña",
        user: "Usuario",
      },

      buttons: {
        google: "Google",
        facebook: "Facebook",
      },
      rules: {
        password: {
          required: "La contraseña es requerida",
          minLength: "La contraseña debe tener al menos 8 caracteres",
          uppercase: "La contraseña debe contener al menos una letra mayúscula",
          number: "La contraseña debe contener al menos un número",
        },
      },
    },
    slides: {
      welcome: {
        title: "Bienvenido a",
        emphasis: "Huoon",
        subtitle: "tu hogar organizado",
        description:
          "Centraliza tareas, miembros, productos y documentos del hogar en un solo lugar.",
      },
      shareHome: {
        title: "Comparte tu casa",
        emphasis: "con tu familia",
        subtitle: "",
        description:
          "Crea un hogar colaborativo donde todos participan: pareja, hijos, roomies o cuidadores.",
      },
      smartTasks: {
        title: "Tareas y recordatorios",
        emphasis: "inteligentes",
        subtitle: "",
        description:
          "Automatiza rutinas, recibe alertas importantes y mantén tu hogar al día fácilmente.",
      },
      controlFromPhone: {
        title: "Todo bajo control",
        emphasis: "desde tu celular",
        subtitle: "",
        description:
          "Consulta información de compras, pagos, recetas, calendarios y más desde cualquier lugar.",
      },
      designedForYou: {
        title: "Diseñado para ti",
        emphasis: "y tu bienestar",
        subtitle: "",
        description:
          "Huoon se adapta a tu estilo de vida: incluye herramientas útiles para todos los miembros del hogar, incluyendo niños y adultos mayores.",
      },
    },
    dataTable: {
      itemsPerPageText: "Elementos por página",
      noDataText: "No hay datos disponibles",
      loadingText: "Cargando datos...",
      search: "Buscar",
    },
    chat: {
      initialMessage: "Hola 👋 ¿En qué te puedo ayudar hoy, {name}?",
      title: "Asistente de Tareas",
      placeholder: "Escribe una respuesta...",
      askType:
        "¿Deseas registrar esta sugerencia como una 'tarea' o una 'meta'?",
      askTitle: "¿Cuál será el título? (Actual: {current})",
      askDescription: "¿Quieres modificar la descripción? (Actual: {current})",
      askPriority: "¿Qué prioridad deseas asignar? (Ej: 1, 2, 3)",
      askStartDate: "¿Cuál es la fecha de inicio? (Actual: {current})",
      askStartTime: "¿A qué hora comenzará? (HH:mm)",
      askEstimatedTime: "¿Cuántos minutos estimas que tomará? (ej: 1h, 30min)",
      askLocation: "¿Dónde se realizará?",
      askRecurrence: "¿Con qué frecuencia se repetirá? (Ej: diaria, semanal)",
      askStatus: "¿Cuál será el estado inicial? (Ej: pendiente, en progreso)",
      completed: "✅ ¡Todo listo! Guardando...",
      invalidSuggestion: "⚠️ No se recibió una sugerencia válida.",
      suggestionMessage:
        "💡 Tienes una nueva sugerencia:\n\n📌 {title}\n📝 {description}\n📅 {date}",
      notAvailable: "No disponible",
      createAsTask: "Crear como tarea",
      createAsGoal: "Crear como meta",
      taskTitle: "Título de la tarea",
      taskDescription: "Descripción de la tarea",
      dateSelected: "Fecha seleccionada: {date}",
      mustSelectParticipants: "⚠️ Debes seleccionar al menos un participante",
      confirmedParticipants:
        "Confirmado {count} participante | Confirmados {count} participantes",
      willModifyParticipants: "Modificaré la selección de participantes",
      selectedParticipants:
        "{count} participante seleccionado | {count} participantes seleccionados",
      inputPlaceholder: "Escribe un mensaje o dicta...",
    },
    general: {
      yes: "Sí",
      no: "No",
    },
    no_definido: "No definido",
    vitalSigns: "Signos Vitales",
    medicalInformation: "Información Médica",
    complementaryData: "Datos Complementarios",
    medicalExamsTitle: "Exámenes Médicos",
    vitalSignsnoData:
      "No ha actualizado los datos de los signos vitales y tratamientos",
    medicalInfonoData: "No se ha definido información médica",
    complementaryDatanoData:
      "No se ha actualizado la información de los datos complementarios",
    medicalExamsnoData: "No se ha realizado exámenes médicos",
    cardMedicamento: "Medicamento Actual",
    cardAlergias: "Alergias",
    cardAntecedentesPersonales: "Antecedentes Personales",
    cardAntecedentesFamiliares: "Antecedentes Familiares",
    cardPlanVacunacion: "Plan de Vacunación",
    cardDiagnostico: "Diagnóstico",
    cardConsultaMedica: "Consulta Médica",
    incomes: "Ingresos",
    expenses: "Gastos",
    menu: {
      desire: {
        title: "Deseos",
        description: "Listas de deseos y compras",
      },
      finance: {
        title: "Finanzas",
        description: "Ingresos, gastos y presupuestos",
      },
      task: {
        title: "Tareas",
        description: "Organiza actividades pendientes",
      },
      personwarehouse: {
        title: "Almacenes",
        description: "Gestiona inventarios",
      },
      product: {
        title: "Productos",
        description: "Catálogo de productos",
      },
      file: {
        title: "Archivos",
        description: "Documentos importantes",
      },
      chat: {
        title: "Chat",
        description: "Comunicación con contactos",
      },
      homes: {
        title: "Hogar",
        description: "Gestión del hogar",
      },
      suggestions: {
        title: "Sugerencias",
        description: "Recomendaciones y propuestas",
      },
      health: {
        title: "Salud",
        description: "Registros médicos y evolución de salud",
      },
      achievements: {
        title: "Logros",
        description: "Registro de logros personales",
      },
      goals: {
        title: "Metas",
        description: "Objetivos y metas personales",
      },
      nutrition: {
        title: "Nutrición",
        description: "Seguimiento alimenticio y dietas",
      },
      pets: {
        title: "Mascotas",
        description: "Cuidado y salud de mascotas",
      },
    },
    viewTitles: {
      physicalExams: "Exámenes Físicos",
      tasks: "Tareas",
      goals: "Metas",
      treatments: "Tratamientos",
      personalBackground: "Antecedentes Personales",
      familyBackground: "Antecedentes Familiares",
      medicalExams: "Exámenes Médicos",
      diagnosis: "Diagnósticos",
      consultations: "Consultas Médicas",
      budget: "Presupuestos",
      incomes: "Ingresos",
      expenses: "Gastos",
      suggestions: "Sugerencias",
    },
    petTitles: {
      vaccines: "Vacunación",
      deworming: "Desparasitación",
      vetVisits: "Visitas Veterinarias",
      currentMedications: "Medicamentos Actuales",
      diet: "Alimentación",
    },
    common: {
      items: "elementos",
      product: "productos",
      last: "Último",
      no_records: "Sin registros",
      no_name: "Sin Nombre",
    },
    activity: {
      // ← nuevo bloque
      title: "Mostrar movimientos de productos",
      origin_warehouse: "Almacén saliente",
      destination_warehouse: "Almacén entrante",
      product: "Producto",
      quantity: "Cantidad",
      date: "Fecha",
      performed_by: "Realizado",
    },
    settings: {
      category: "Categorías",
      warehouse: "Almacenes",
      priority: "Prioridades",
      role: "Roles",
      status: "Estados",
      hometype: "Tipos de Hogar",
      type: "Tipos de Salud",
      history: "Historia Clínica",
      actions: "Acciones",
    },
    taskForm: {
      noTasksToday: "No tienes tareas para realizar en el día de hoy",
      updateStatus: "Actualizar Estado",
      dialogTitle: "Detalles",
      fields: {
        title: "Título",
        date: "Fecha",
        time: "Hora",
        priority: "Prioridad",
        type: {
          label: "Tipo",
          task: "Tarea",
          event: "Evento",
        },
        status: "Estado",
        category: "Categoría",
        recurrence: "Recurrencia",
        description: "Descripción",
        comments: "Comentarios",
        participants: "Participantes",
        estimatedTime: "Tiempo estimado (hrs)",
        location: "Ubicación",
        endDate: "Fecha de terminación",
        endTime: "Hora de finalización",
      },
      buttons: {
        addDetails: "Agregar detalles",
        hideDetails: "Ocultar detalles",
        cancel: "Cancelar",
        save: "Guardar",
        confirmDelete: "Aceptar",
        close: "Cerrar",
        previous: "Anterior",
        next: "Siguiente",
        saveAndClose: "Guardar y Cerrar",
      },
      validation: {
        required: "Este campo es requerido",
        positiveNumber: "Debe ser un número positivo válido",
      },
      today: "Hoy",
      titles: {
        new: "Agregar Nueva Tarea",
        edit: "Editar Tarea",
        newGoal: "Agregar Nueva Meta",
        editGoal: "Editar Meta",
        discoverGoals: "Descubre metas",
        discoverTasks: "Descubre tareas",
        homeGoalsTitle: "Metas del hogar",
        newGoals: "Nuevas Metas",
        newTasks: "Nuevas Tareas",
      },
    },
    taskTypes: {
      Tarea: "Tarea",
      Meta: "Meta",
    },
    formInstructions: "Introduce los datos solicitados a continuación",
    steps: {
      "Información Básica": {
        title: "Información Básica",
        subtitle: "Ingresa el título y descripción",
      },
      Asignación: {
        title: "Asignación",
        subtitle: "Selecciona responsables y participantes",
      },
      Programación: {
        title: "Programación",
        subtitle: "Elige fecha y hora de la tarea",
      },
    },
    buttons: {
      addDetails: "Agregar detalles",
      hideDetails: "Ocultar detalles",
      cancel: "Cancelar",
      save: "Guardar",
      confirmDelete: "Aceptar",
      close: "Cerrar",
      previous: "Anterior",
      next: "Siguiente",
      saveAndClose: "Guardar y Cerrar",
      seeMore: "Ver más",
      delete: "Eliminar",
      edit: "Editar",
      moveProduct: "Mover a otro almacén",
      create: "Crear",
      move: "Mover",
    },
    deleteDialog: {
      title: "Eliminar {item}",
      message: "¿Desea eliminar el elemento seleccionado?",
      confirm: "Confirmar eliminación",
      items: {
        file: "archivo",
        product: "producto",
        warehouse: "almacén",
        wish: "deseo",
        task: "tarea",
        physicalExam: "examen físico",
        treatment: "tratamiento",
        personalBackground: "antecedente personal",
        familyBackground: "antecedente familiar",
        medicalExam: "examen médico",
        diagnosis: "diagnóstico",
        medicalConsultation: "consulta médica",
        default: "elemento",
        budget: "presupuesto",
        income: "ingreso",
        expense: "gasto",
        blood_pressure: "presión arterial",
        pulse: "pulso",
        respiratory_rate: "frecuencia respiratoria",
        temperature: "temperatura",
        weight: "peso",
        height: "altura",
      },
    },
    personDetails: {
      age: {
        withValue: "Edad: {age} años",
        withoutValue: "Edad: No especificada",
      },
      documentType: {
        withValue: "Tipo de identificación: {type}",
        withoutValue: "Sin tipo de identificación",
      },
      documentNumber: {
        withValue: "ID Paciente: {number}",
        withoutValue: "ID no especificado",
      },
    },
    petDetails: {
      name: {
        withValue: "Nombre: {name}",
        withoutValue: "Mascota sin nombre",
      },
      breed: {
        withValue: "Raza: {breed}",
        withoutValue: "Raza no especificada",
      },
      age: {
        withValue: "Edad: {age} años",
        withoutValue: "Edad no especificada",
      },
      sex: {
        withValue: "Sexo: {sex}",
        withoutValue: "Sexo no especificado",
      },
    },
    gender: {
      male: "Macho",
      female: "Hembra",
      other: "Otro",
    },
    //examenes fisicos
    physicalExam: {
      formInstructions:
        "Complete todos los campos requeridos del examen físico",
      steps: {
        vital_signs: {
          title: "Signos Vitales",
          subtitle: "Datos básicos del paciente",
        },
        body_measurements: {
          title: "Medidas Corporales",
          subtitle: "Peso, altura e IMC",
        },
        observations: {
          title: "Observaciones",
          subtitle: "Examen por sistemas",
        },
      },
      fields: {
        blood_pressure: "Presión Arterial",
        pulse: "Frecuencia Cardíaca",
        temperature: "Temperatura",
        respiratory_rate: "Frecuencia Respiratoria",
        exam_date: "Fecha",
        weight: "Peso (kg)",
        height: "Altura (m)",
        bmi: "Índice de Masa Corporal",
        neurological_observations: "Observaciones Neurológicas",
        cardiovascular_observations: "Observaciones Cardiovasculares",
        respiratory_observations: "Observaciones Respiratorias",
        digestive_observations: "Observaciones Digestivas",
        urinary_observations: "Observaciones Urinarias",
        other_findings: "Otros Hallazgos",
      },
      forms: {
        blood_pressure: {
          title: {
            add: "Agregar Presión Arterial",
            edit: "Editar Presión Arterial",
          },
        },
        pulse: {
          title: {
            add: "Agregar Frecuencia Cardíaca",
            edit: "Editar Frecuencia Cardíaca",
          },
        },
        temperature: {
          title: {
            add: "Agregar Temperatura",
            edit: "Editar Temperatura",
          },
        },
        respiratory_rate: {
          title: {
            add: "Agregar Frecuencia Respiratoria",
            edit: "Editar Frecuencia Respiratoria",
          },
        },
        weight: {
          title: {
            add: "Agregar Peso",
            edit: "Editar Peso",
          },
        },
        height: {
          title: {
            add: "Agregar Altura",
            edit: "Editar Altura",
          },
        },
        bmi: {
          title: {
            add: "Agregar Índice de Masa Corporal",
            edit: "Editar Índice de Masa Corporal",
          },
        },
      },
      titles: {
        new: "Nuevo Examen Físico",
        edit: "Editar Examen Físico",
      },
    },
    //tratamiento
    treatment: {
      cardMedicamento: "Medicamento",
      cardMedicamentosPlural: "Medicamentos ({count})",
      medicamentosActivos: "{count} medicamentos activos",
      no_definido: "No definido",
      formInstructions: "Complete todos los campos requeridos del tratamiento",
      noTreatments: "No hay tratamientos definidos aún",
      steps: {
        medication: {
          title: "Medicación",
          subtitle: "Detalles de la medicación",
        },
        details: {
          title: "Detalles",
          subtitle: "Instrucciones y propósito",
        },
        dates: {
          title: "Fechas",
          subtitle: "Período del tratamiento",
        },
      },
      fields: {
        medication: "Medicamento",
        dosage: "Dosis",
        frequency: "Frecuencia",
        duration: "Duración",
        durationHint:
          "Indique la duración con número y unidad (días, semanas, meses)",
        instructions: "Instrucciones",
        purpose: "Propósito",
        startDate: "Inicio",
        endDate: "Fecha de fin",
        observations: "Observaciones",
      },
      titles: {
        new: "Agregar Tratamiento",
        edit: "Editar Tratamiento",
      },
      validationMessages: {
        medication: {
          required: "El medicamento es requerido",
          maxLength: "El medicamento no puede exceder 100 caracteres",
        },
        dosage: {
          maxLength: "La dosis no puede exceder 50 caracteres",
        },
        frequency: {
          maxLength: "La frecuencia no puede exceder 50 caracteres",
        },
        duration: {
          maxLength: "La duración no puede exceder 50 caracteres",
        },
        startDate: {
          invalid: "Fecha de inicio inválida",
        },
        endDate: {
          invalid: "Fecha de fin inválida",
        },
      },
    },
    //antecedentes personales
    personalBackground: {
      formInstructions: "Complete todos los campos de antecedentes personales",
      steps: {
        details: {
          title: "Detalles",
          subtitle: "Información de la condición médica",
        },
        additional: {
          title: "Información Adicional",
          subtitle: "Observaciones clínicas",
        },
        dates: {
          title: "Fechas",
          subtitle: "Cronología de la condición",
        },
      },
      fields: {
        type: "Tipo de condición",
        description: "Condición médica",
        details: "Detalles clínicos",
        startDate: "Fecha",
        endDate: "Fecha de resolución",
        status: "Estado",
        severity: "Severidad",
        vaccination: "Vacunación",
        allergy: "Alergia",
      },
      titles: {
        new: "Agregar Antecedente Personal",
        edit: "Editar Antecedente Personal",
        view: "Antecedentes Médicos Personales",
        vaccination: {
          new: "Agregar Vacuna",
          edit: "Editar Vacuna",
          view: "Detalles de Vacuna",
        },
        allergy: {
          new: "Agregar Alergia",
          edit: "Editar Alergia",
          view: "Detalles de Alergia",
        },
      },
      validationMessages: {
        type: {
          required: "El tipo de condición es requerido",
        },
        description: {
          required: "La descripción médica es obligatoria",
          maxLength: "La descripción no puede exceder 200 caracteres",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron antecedentes personales",
    },
    //antecedentes familiares
    familyBackground: {
      formInstructions: "Complete todos los campos de antecedentes familiares",
      steps: {
        details: {
          title: "Datos Familiares",
          subtitle: "Información del familiar",
        },
        additional: {
          title: "Información Médica",
          subtitle: "Detalles de la condición de salud",
        },
      },
      fields: {
        type: "Tipo de Condición",
        relationship: "Parentesco",
        disease: "Enfermedad/Condición",
        details: "Detalles Médicos",
        date: "Fecha",
        diagnosis_age: "Edad al Diagnóstico",
      },
      titles: {
        new: "Agregar Antecedente Familiar",
        edit: "Editar Antecedente Familiar",
        view: "Antecedentes Médicos Familiares",
      },
      validationMessages: {
        type: {
          required: "El tipo de condición es requerido",
        },
        relationship: {
          required: "El parentesco es requerido",
        },
        disease: {
          required: "La enfermedad/condición es requerida",
          maxLength:
            "El nombre de la enfermedad no puede exceder 100 caracteres",
        },
        diagnosis_age: {
          invalid: "La edad debe estar entre 0 y 120 años",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron antecedentes familiares",
    },
    medicalExams: {
      formInstructions: "Complete todos los campos del examen médico",
      steps: {
        examDetails: {
          title: "Detalles del Examen",
          subtitle: "Información básica del examen",
        },
        results: {
          title: "Resultados",
          subtitle: "Resultados y observaciones del examen",
        },
      },
      fields: {
        type: "Tipo de Examen",
        exam_name: "Nombre del Examen",
        results: "Resultados",
        observations: "Observaciones",
        date: "Fecha del Examen",
        file: "Archivo Adjunto",
        attach_file: "Adjuntar Archivo",
      },
      actions: {
        viewFile: "Ver Archivo",
        downloadFile: "Descargar",
      },
      titles: {
        new: "Agregar Examen Médico",
        edit: "Editar Examen Médico",
        view: "Exámenes Médicos",
      },
      validationMessages: {
        type: {
          required: "El tipo de examen es obligatorio",
        },
        exam_name: {
          maxLength: "El nombre no puede exceder 200 caracteres",
          invalid: "El nombre es obligatorio",
        },
        date: {
          required: "La fecha del examen es obligatoria",
          invalid: "La fecha debe ser válida",
        },
        file: {
          invalidType:
            "Solo se permiten imágenes (PNG, JPG), PDF y documentos Word",
          sizeExceeded: "El tamaño del archivo debe ser menor a 5MB",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron exámenes médicos",
    },
    diagnoses: {
      formInstructions: "Complete todos los campos del diagnóstico",
      steps: {
        details: {
          title: "Detalles del diagnóstico",
          subtitle: "Información principal del diagnóstico",
        },
        additional: {
          title: "Información adicional",
          subtitle: "Notas y observaciones",
        },
      },
      fields: {
        type: "Tipo de diagnóstico",
        description: "Descripción",
        cie10_code: "Código CIE-10",
        notes: "Notas",
        date: "Fecha",
      },
      titles: {
        new: "Nuevo diagnóstico",
        edit: "Editar diagnóstico",
        view: "Diagnósticos",
      },
      validationMessages: {
        type: {
          required: "El tipo de diagnóstico es requerido",
        },
        description: {
          required: "La descripción es requerida",
          maxLength: "La descripción no puede exceder los 500 caracteres",
        },
        cie10_code: {
          maxLength: "El código CIE-10 no puede exceder los 20 caracteres",
        },
        date: {
          required: "La fecha es requerida",
        },
      },
      notRecorded: "No registrado",
      noRecords: "No se encontraron diagnósticos",
    },
    consultations: {
      formInstructions: "Complete todos los campos de la consulta médica",
      steps: {
        details: {
          title: "Detalles de la Consulta",
          subtitle: "Información principal de la consulta",
        },
        additional: {
          title: "Información Adicional",
          subtitle: "Notas y observaciones",
        },
      },
      fields: {
        type: "Tipo de Consulta",
        profesional: "Profesional",
        reason: "Motivo de Consulta",
        medicalNotes: "Notas Médicas",
        date: "Fecha",
      },
      validationMessages: {
        type: {
          required: "El tipo de consulta es obligatorio",
        },
        profesional: {
          required: "El profesional es obligatorio",
          maxLength: "No puede exceder 100 caracteres",
        },
        reason: {
          required: "El motivo es obligatorio",
          maxLength: "No puede exceder 500 caracteres",
        },
        date: {
          required: "La fecha es obligatoria",
          invalid: "La fecha no es válida",
        },
      },
      titles: {
        new: "Agregar Consulta Médica",
        edit: "Editar Consulta Médica",
        view: "Consultas Médicas",
      },
    },
    personManagement: {
      formInstructions:
        "Complete todos los campos requeridos para registrar la información de la persona",
      edit_title: "Editar Persona",
      create_title: "Nueva Persona",
      no_changes: "No se realizaron cambios",
      save_error: "Error al guardar la información",
      steps: {
        basic_info: {
          title: "Información Básica",
          subtitle: "Datos principales de la persona",
        },
        personal_info: {
          title: "Información Personal",
          subtitle: "Detalles personales y contacto",
        },
        medical_info: {
          title: "Información Médica",
          subtitle: "Datos médicos y documentación",
        },
      },
      fields: {
        profile_image: "Imagen de perfil",
        name: "Nombre completo",
        username: "Nombre de usuario",
        password: "Contraseña",
        language: "Idioma",
        birth_date: "Fecha de nacimiento",
        age: "Edad",
        gender: "Género",
        emergency_contact: "Contacto de emergencia",
        email: "Correo electrónico",
        phone: "Teléfono",
        address: "Dirección",
        medical_record_number: "Número de historial médico",
        document_type: "Tipo de documento",
        document_number: "Número de documento",
        health_coverage: "Cobertura de salud",
        coverage_name: "Nombre de la cobertura",
        blood_type: "Tipo de sangre",
      },
      genders: {
        male: "Masculino",
        female: "Femenino",
        other: "Otro",
      },
      documentTypes: {
        id: "Cédula",
        passport: "Pasaporte",
        driver_license: "Licencia de conducir",
      },
      healthCoverages: {
        public: "Pública",
        private: "Privada",
        none: "Ninguna",
      },
      validation: {
        name_required: "El nombre es requerido",
        email_valid: "El correo electrónico debe ser válido",
        image_size: "La imagen debe ser menor a 500KB",
      },
    },
    finances: {
      formInstructions: {
        income: "Complete todos los campos del registro de ingresos",
        expense: "Complete todos los campos del registro de gastos",
        finance: "Complete todos los campos del registro financiero", // General por si acaso
      },
      steps: {
        financialDetails: {
          title: "Detalles Financieros",
          subtitle: "Información básica del registro",
        },
        description: {
          title: "Descripción",
          subtitle: "Detalles adicionales",
        },
      },
      fields: {
        type: "Tipo",
        method: "Método de Pago",
        income: "Ingreso",
        spent: "Gasto",
        description: "Descripción",
        date: "Fecha",
        file: "Comprobante",
        attach_file: "Adjuntar Comprobante",
        available: "Disponible",
        total: "Total",
        budget: "Presupuesto",
        category: "Categoría",
        currency: "Moneda",
        saldo: "Saldo",
      },
      actions: {
        viewFile: "Ver Comprobante",
        downloadFile: "Descargar",
      },
      titles: {
        new: {
          income: "Agregar Ingreso",
          expense: "Agregar Gasto",
          finance: "Agregar Registro" /*  Financiero*/,
        },
        edit: {
          income: "Editar Ingreso",
          expense: "Editar Gasto",
          finance: "Editar Registro",
        },
        view: {
          income: "Registros de Ingresos",
          expense: "Registros de Gastos",
          finance: "Registros Financieros",
        },
      },
      validationMessages: {
        type: {
          required: "El tipo es requerido",
          maxLength: "El tipo no puede exceder 50 caracteres",
        },
        method: {
          maxLength: "El método no puede exceder 50 caracteres",
        },
        income: {
          number: "El ingreso debe ser un número",
          precision: "El ingreso debe tener máximo 2 decimales",
        },
        spent: {
          number: "El gasto debe ser un número",
          precision: "El gasto debe tener máximo 2 decimales",
        },
        description: {
          maxLength: "La descripción no puede exceder 255 caracteres",
        },
        date: {
          required: "La fecha es obligatoria",
          invalid: "La fecha debe ser válida",
        },
        file: {
          invalidType: "Solo se permiten imágenes (PNG, JPG)",
          sizeExceeded: "El tamaño del archivo debe ser menor a 500KB",
        },
      },
      notRecorded: "Sin registro",
      noRecords: "No se encontraron registros financieros",
      header: {
        title: "Finanzas del Hogar",
        subtitle: "Control familiar de ingresos y gastos",
      },
      suggestions: {
        title: "Sugerencias Inteligentes",
        alerts: {
          message: "Tienes {count} alerta para hoy",
          message_plural: "Tienes {count} alertas para hoy",
        },
      },
      comparison: {
        lastMonth: "Mes pasado",
        thisMonth: "Este mes",
        vs: "vs {amount}",
      },
      sections: {
        balance: "Balance",
        movements: "Movimientos",
        suggestions: "Sugerencias",
        budget: "Presupuestos",
      },
      currentAmount: "<strong>{amount}</strong> actual",
      charts: {
        incomeVsSpent: "Ingresos vs Gastos",
        generateDemo: "Generar Datos Demo",
        monthlySummary: "Resumen Mensual",
        totalIncome: "Ingreso Total",
        totalSpent: "Gasto Total",
        balance: "Balance",
      },
      months: {
        jan: "Ene",
        feb: "Feb",
        mar: "Mar",
        apr: "Abr",
        may: "May",
        jun: "Jun",
        jul: "Jul",
        aug: "Ago",
        sep: "Sep",
        oct: "Oct",
        nov: "Nov",
        dec: "Dic",
      },
    },
    summary: {
      title: "Resumen de",
    },
    budget: {
      formInstructions: "Complete todos los campos del presupuesto",
      steps: {
        basic: {
          title: "Información Básica",
          subtitle: "Datos principales del presupuesto",
        },
        dates: {
          title: "Fechas y Detalles",
          subtitle: "Período y descripción",
        },
      },
      fields: {
        category: "Categoría",
        budget_type: "Tipo",
        amount: "Monto",
        used_amount: "Monto Utilizado",
        start_date: "Fecha de Inicio",
        end_date: "Fecha de Fin",
        description: "Descripción",
        status: "Estado",
        currency: "Moneda",
        period: "Período",
      },
      status: {
        active: "Activo",
        inactive: "Inactivo",
        completed: "Completado",
        exceeded: "Excedido",
      },
      currencies: {
        USD: "Dólar Estadounidense",
        EUR: "Euro",
        BRL: "Real Brasileño",
        MXN: "Peso Mexicano",
        COP: "Peso Colombiano",
        CLP: "Peso Chileno",
      },
      titles: {
        new: "Agregar Presupuesto",
        edit: "Editar Presupuesto",
        view: "Presupuestos",
      },
      validationMessages: {
        category: {
          required: "La categoría es requerida",
        },
        amount: {
          required: "El monto es requerido",
          invalid: "El monto debe ser mayor a 0",
        },
        used_amount: {
          invalid: "El monto utilizado no puede exceder el monto total",
        },
        start_date: {
          invalid: "La fecha de inicio debe ser anterior a la fecha de fin",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron presupuestos",
    },
    suggestedTasks: {
      dialog: {
        title: "Tareas sugeridas",
        subtitle: "Selecciona las tareas que deseas agregar",
        closeButton: "Cerrar",
        createButton: "Crear tareas seleccionadas",
        noTasks: "No hay tareas sugeridas disponibles",
        unassigned: "Sin asignar",
      },
      fields: {
        date: "Fecha",
        time: "Hora",
        duration: "Duración",
        title: "Título",
        description: "Descripción",
        location: "Ubicación",
        score: "Puntuación",
      },
      selection: {
        count: "({{count}} seleccionadas)",
      },
      steps: {
        selection: {
          title: "Selección de tareas",
          subtitle: "Elige las tareas relevantes",
        },
      },
      scoreTooltip: "Puntos por completar esta tarea",
      scoreValues: {
        low: "Baja (1-3 pts)",
        medium: "Media (4-7 pts)",
        high: "Alta (8-10 pts)",
      },
    },
    warehouse: {
      formTitle: {
        create: "Crear almacén",
        edit: "Editar almacén",
        generateShoppingList: "Generar Lista de compra",
        inventory: "Inventario",
        movements: "Movimientos",
      },
      formInstructions: "Complete la información requerida para el almacén",
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Detalles principales",
        },
        configuration: {
          title: "Configuración adicional",
          subtitle: "Estado y descripción",
        },
      },
      fields: {
        warehouse: "Almacenes",
        name: "Nombre",
        home_location: "Ubicación en la casa",
        status: "Tipo",
        description: "Descripción",
      },
      status: {
        public: "Hogar",
        private: "Personal",
      },
      validation: {
        required: "{field} es requerido",
        min_length: "{field} debe tener al menos {length} caracteres",
        max_length: "{field} debe tener menos de {length} caracteres",
        invalid_selection: "Por favor seleccione un {field} válido",
        invalid_format: "Formato de {field} no válido",
      },
      list: {
        title: "Listado de Almacenes",
        empty: "No hay almacenes registrados",
        search: "Buscar almacenes...",
        columns: {
          name: "Nombre",
          location: "Ubicación",
          status: "Estado",
          actions: "Acciones",
        },
      },
      titles: {
        products: "Productos",
        lowStock: "Bajo Stock",
        expiringSoon: "Por Vencer",
        categories: "Categorías",
        storageLocations: "Ubicaciones",
      },
    },
    product: {
      listing: {
        title: "Listado de productos",
        addButton: "Agregar Producto",
        description: "Descripción",
        quantity: "Cantidad",
        delete: "Eliminar",
        edit: "Editar",
        noProducts: "No hay productos en este almacén",
      },
      formTitle: {
        create: "Crear nuevo producto",
        edit: "Editar producto",
      },
      formInstructions: "Complete la información requerida para el producto",
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Detalles principales del producto",
        },
        purchase: {
          title: "Información de compra",
          subtitle: "Detalles de adquisición",
        },
        additional: {
          title: "Configuración adicional",
          subtitle: "Opciones complementarias",
        },
      },
      fields: {
        name: "Nombre",
        brand: "Marca",
        image: "Imagen del producto",
        additional_notes: "Notas adicionales",
        unit_price: "Precio unitario",
        quantity: "Cantidad",
        total_price: "Precio total",
        status: "Estado",
        category: "Categoría",
        purchase_date: "Fecha",
        expiration_date: "Fecha de expiración",
        frequency: "Frecuencia (horas)",
        type: "Tipo",
        purchase_place: "Lugar de compra",
      },
      types: {
        winter: "Invierno",
        summer: "Verano",
      },
      validation: {
        required: "{field} es requerido",
        min_length: "{field} debe tener al menos {length} caracteres",
        invalid_number: "{field} debe ser un número válido",
        no_data: "No hay datos disponibles",
        min_value: "{field} debe ser mayor o igual a {value}",
      },
    },
    files: {
      listing: {
        title: "Gestión de Archivos",
        addButton: "Agregar Archivo",
        search: "Buscar",
        noData: "No hay datos disponibles",
        loading: "Cargando datos...",
        itemsPerPage: "Elementos por página",
        actions: {
          view: "Ver archivo",
          edit: "Editar",
          delete: "Eliminar",
          download: "Descargar Archivo",
        },
        types: {
          personal: "Personal",
          home: "Hogar",
          all: "Todos",
        },
      },
      formTitle: {
        create: "Crear nuevo archivo",
        edit: "Editar archivo",
      },
      formInstructions: "Complete la información requerida para el archivo",
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos principales del archivo",
        },
        file_config: {
          title: "Archivo y tipo",
          subtitle: "Configuración del documento",
        },
      },
      fields: {
        name: "Nombre",
        date: "Fecha",
        type: "Tipo",
        description: "Descripción",
        file: "Archivo",
        preview: "Vista previa",
        actions: "Acciones",
      },
      types: {
        personal: "Personal",
        home: "Hogar",
      },
      validation: {
        required: "{field} es requerido",
        invalidFile: "Formato de archivo no válido",
      },
    },
    wishes: {
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Detalles principales del deseo",
        },
        details: {
          title: "Fechas y prioridad",
          subtitle: "Configuración de cumplimiento",
        },
        additional: {
          title: "Información adicional",
          subtitle: "Ubicación y descripción",
        },
      },
      listing: {
        title: "Gestión de Deseos",
        addButton: "Agregar Deseo",
        search: "Buscar",
        noData: "No hay deseos disponibles",
        loading: "Cargando deseos...",
        itemsPerPage: "Deseos por página",
        actions: {
          edit: "Editar",
          delete: "Eliminar",
        },
        types: {
          personal: "Personal",
          home: "Hogar",
          professional: "Profesional",
          all: "Todos",
        },
      },
      formTitle: {
        create: "Crear nuevo deseo",
        edit: "Editar deseo",
      },
      formInstructions: "Complete la información del deseo",
      fields: {
        name: "Nombre",
        type: "Tipo",
        date: "Fecha",
        fulfillment_date: "Fecha de cumplimiento",
        priority: "Prioridad",
        status: "Estado",
        location: "Ubicación",
        description: "Descripción",
        actions: "Acciones",
      },
      priorities: {
        low: "Baja",
        medium: "Media",
        high: "Alta",
        urgent: "Urgente",
      },
      statuses: {
        pending: "Pendiente",
        in_progress: "En progreso",
        completed: "Completado",
        cancelled: "Cancelado",
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "Fecha no válida",
      },
    },
    suggestions: {
      formInstructions: {
        suggestion: "Complete todos los campos de la sugerencia",
      },
      steps: {
        suggestionDetails: {
          title: "Detalles de la Sugerencia",
          subtitle: "Información básica del registro",
        },
        content: {
          title: "Contenido",
          subtitle: "Detalles adicionales",
        },
      },
      fields: {
        title: "Título",
        description: "Descripción",
        content: "Contenido",
        date: "Fecha",
        status: "Estado",
        type: "Tipo",
      },
      statuses: {
        Pendiente: "Pendiente",
        Revisado: "Revisado",
        Completado: "Completado",
        Rechazado: "Rechazado",
      },
      types: {
        // Tipos de sugerencias que definas
      },
      titles: {
        new: "Nueva Sugerencia",
        edit: "Editar Sugerencia",
        view: "Registros de Sugerencias",
      },
      validationMessages: {
        title: {
          maxLength: "El título no debe exceder los 255 caracteres",
        },
        description: {
          maxLength: "La descripción no puede exceder 500 caracteres",
        },
        content: {
          maxLength: "El contenido no puede exceder 1000 caracteres",
        },
        date: {
          required: "La fecha es obligatoria",
          invalid: "La fecha debe ser válida",
        },
        status: {
          invalid:
            "El estado debe ser uno de: pendiente, revisado, aprobado, rechazado",
        },
      },
      noRecords: "No se encontraron sugerencias",
      header: {
        title: "Sugerencias del Hogar",
        subtitle: "Recomendaciones y propuestas familiares",
      },
    },
    home: {
      //create: {
      title: "Hogares asociados", // Cambiado de "Listado de Almacenes"
      empty: "No hay hogares registrados", // Ajustado
      search: "Buscar hogares...", // Ajustado,
      addButton: "Crear un nuevo hogar",
      instructions: "Complete todos los campos requeridos para crear su hogar",
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos principales del hogar",
        },
        details: {
          title: "Detalles adicionales",
          subtitle: "Configuraciones del hogar",
        },
        members: {
          title: "Miembros del hogar",
          subtitle: "Agregar personas al hogar",
        },
      },
      fields: {
        name: "Nombre del hogar",
        address: "Dirección",
        type: "Tipo de hogar",
        code: "Código de acceso",
        geoLocation: "Geolocalización",
        timezone: "Zona horaria",
        residents: "Número de residentes",
        image: "Imagen del hogar",
        status: "Estado",
        ranking: "Ranking",
      },
      membersTable: {
        avatar: "Foto",
        name: "Nombre",
        email: "Correo",
        role: "Rol",
        actions: "Acciones",
      },
      actions: {
        cancel: "Cancelar",
        previous: "Anterior",
        next: "Siguiente",
        create: "Crear Hogar",
        edit: "Editar Hogar",
        addMembers: "Agregar Miembros",
      },
      validation: {
        nameRequired: "El nombre del hogar es requerido",
        nameMinLength: "El nombre debe tener al menos 3 caracteres",
        codeRequired: "El código de acceso es requerido",
        codeMinLength: "El código debe tener al menos 8 caracteres",
      },
      //},
      types: {
        house: "Casa",
        apartment: "Departamento",
        other: "Otro",
      },
    },
    pets: {
      title: "Mascotas del hogar",
      empty: "No hay mascotas registradas",
      search: "Buscar mascotas...",
      addButton: "Registrar nueva mascota",
      managePet: "Información de la mascota",
      instructions:
        "Complete todos los campos requeridos para registrar su mascota",
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos principales de la mascota",
        },
        details: {
          title: "Detalles adicionales",
          subtitle: "Características físicas",
        },
      },
      fields: {
        name: "Nombre de la mascota",
        category: "Tipo de mascota",
        breed: "Raza",
        sex: "Sexo",
        age: "Edad",
        date_birth: "Fecha de nacimiento o adopción",
        color: "Color",
        microchip: "Número de microchip",
        signs: "Señas particulares",
        image: "Foto de la mascota",
        home: "Hogar al que pertenece",
        owner: "Dueño responsable",
      },
      table: {
        avatar: "Foto",
        name: "Nombre",
        type: "Tipo",
        breed: "Raza",
        age: "Edad",
        actions: "Acciones",
      },
      actions: {
        cancel: "Cancelar",
        previous: "Anterior",
        next: "Siguiente",
        create: "Registrar Mascota",
        edit: "Editar Mascota",
        addHealth: "Agregar Info. Médica",
      },
      validation: {
        nameRequired: "El nombre de la mascota es requerido",
        categoryRequired: "El tipo de mascota es requerido",
        agePositive: "La edad debe ser un número positivo",
        microchipLength: "El microchip debe tener 15 caracteres",
      },
      types: {
        dog: "Perro",
        cat: "Gato",
        bird: "Ave",
        reptile: "Reptil",
        other: "Otro",
      },
      gender: {
        male: "Macho",
        female: "Hembra",
        other: "Otro",
      },
      health: {
        vaccines: "Vacunas",
        lastVisit: "Última visita al veterinario",
        specialNeeds: "Necesidades especiales",
      },
      alerts: {
        title: "Alertas",
        count: "{count} alerta activa | {count} alertas activas",
      },
    },
    vaccinations: {
      listing: {
        title: "Gestión de Vacunaciones",
        addButton: "Agregar Vacunación",
        noData: "No hay vacunaciones registradas",
      },
      formTitle: {
        create: "Registrar nueva vacunación",
        edit: "Editar vacunación",
      },
      formInstructions: "Complete la información de la vacunación",
      fields: {
        name: "Nombre de la vacuna",
        date: "Fecha",
        next_date: "Próxima dosis",
        pet: "Mascota",
        notes: "Observaciones",
      },
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos de la vacuna y mascota",
        },
        schedule: {
          title: "Programación",
          subtitle: "Fechas de aplicación",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "Fecha no válida",
        future_date: "La fecha no puede ser futura",
        min_dosage: "La dosis mínima es {min}",
        max_dosage: "La dosis máxima es {max}",
      },
    },
    dewormings: {
      listing: {
        title: "Gestión de Desparasitaciones",
        addButton: "Agregar Desparasitación",
        noData: "No hay desparasitaciones registradas",
      },
      formTitle: {
        create: "Registrar nueva desparasitación",
        edit: "Editar desparasitación",
      },
      formInstructions: "Complete la información de la desparasitación",
      fields: {
        name: "Producto",
        dosage: "Dosis",
        unit: "Unidad",
        date: "Fecha",
        next_date: "Próxima aplicación",
        pet: "Mascota",
        notes: "Observaciones",
      },
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos del producto y mascota",
        },
        details: {
          title: "Detalles",
          subtitle: "Dosis y programación",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "Fecha no válida",
        future_date: "La fecha no puede ser futura",
        min_dosage: "La dosis mínima es {min}",
        max_dosage: "La dosis máxima es {max}",
        invalid_unit: "Unidad no válida",
      },
    },
    vet_visits: {
      listing: {
        title: "Gestión de Visitas al Veterinario",
        addButton: "Agregar Visita",
        noData: "No hay visitas al veterinario registradas",
      },
      formTitle: {
        create: "Registrar nueva visita al veterinario",
        edit: "Editar visita al veterinario",
      },
      formInstructions: "Complete la información de la visita al veterinario",
      fields: {
        date: "Fecha",
        vet_name: "Veterinario",
        clinic: "Clínica o consultorio",
        reason: "Motivo de la visita",
        diagnosis: "Diagnóstico",
        treatment_given: "Tratamiento aplicado",
        recommendations: "Recomendaciones",
        next_visit: "Próxima cita",
        image: "Documento",
      },
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Datos de la visita y profesional",
        },
        medical: {
          title: "Detalles médicos",
          subtitle: "Diagnóstico y tratamiento aplicado",
        },
        follow_up: {
          title: "Seguimiento",
          subtitle: "Próxima cita y documentos",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "Fecha no válida",
        future_date: "La fecha no puede ser futura",
        invalid_clinic: "Nombre de clínica no válido",
        min_length_reason: "El motivo debe tener al menos 3 caracteres",
        max_length_diagnosis:
          "El diagnóstico no puede exceder los 500 caracteres",
        max_file_size: "El archivo no debe superar 5 MB",
      },
    },
    current_medications: {
      listing: {
        title: "Gestión de Medicamentos Actuales",
        addButton: "Agregar Medicamento",
        noData: "No hay medicamentos actuales registrados",
      },
      formTitle: {
        create: "Registrar nuevo medicamento",
        edit: "Editar medicamento",
      },
      formInstructions: "Complete la información del medicamento actual",
      fields: {
        name: "Nombre del medicamento",
        dosage: "Dosis",
        unit: "Unidad",
        type_id: "Frecuencia",
        route: "Vía de administración",
        start_date: "Fecha",
        end_date: "Fecha de fin",
        notes: "Observaciones",
        prescribed_by: "Recetado por",
      },
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Nombre, dosis y vía",
        },
        prescription: {
          title: "Receta",
          subtitle: "Frecuencia y profesional",
        },
        schedule: {
          title: "Duración",
          subtitle: "Inicio y fin del tratamiento",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "Fecha no válida",
        future_date: "La fecha no puede ser futura",
        min_dosage: "La dosis mínima es {min}",
        max_dosage: "La dosis máxima es {max}",
        end_before_start:
          "La fecha de fin no puede ser anterior a la de inicio",
      },
    },
    pet_diets: {
      listing: {
        title: "Gestión de Dietas de Mascota",
        addButton: "Agregar Dieta",
        noData: "No hay dietas registradas para esta mascota",
      },
      formTitle: {
        create: "Registrar nueva dieta",
        edit: "Editar dieta",
      },
      formInstructions: "Complete la información sobre la dieta de la mascota",
      fields: {
        name: "Nombre de la dieta",
        pet_id: "Mascota",
        food_type: "Tipo de alimento",
        brand: "Marca",
        portion_size: "Tamaño de porción",
        unit: "Unidad",
        type_id: "Frecuencia",
        special_instructions: "Instrucciones especiales",
      },
      steps: {
        basic: {
          title: "Información básica",
          subtitle: "Tipo, marca y porción",
        },
        schedule: {
          title: "Frecuencia",
          subtitle: "Con qué frecuencia se administra",
        },
        details: {
          title: "Detalles adicionales",
          subtitle: "Instrucciones especiales",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_number: "El valor debe ser un número válido",
        min_portion: "El tamaño mínimo de porción es {min}",
        max_portion: "El tamaño máximo de porción es {max}",
        future_date: "La fecha no puede ser futura",
      },
    },
    nutrition_profile: {
      listing: {
        title: "Perfil Nutricional",
        noData: "No hay perfil nutricional registrado",
      },
      formTitle: {
        create: "Crear perfil nutricional",
        edit: "Editar perfil nutricional",
      },
      formInstructions: "Complete las metas diarias nutricionales del usuario",
      fields: {
        calories: "Calorías diarias",
        protein: "Proteína (g)",
        carbs: "Carbohidratos (g)",
        fats: "Grasas totales (g)",
        fiber: "Fibra (g)",
        sugar_limit: "Límite de azúcar (g)",
        sat_fats_limit: "Límite de grasas saturadas (g)",
        water: "Agua diaria (L)",
      },
      validation: {
        required: "{field} es requerido",
        invalid_number: "El valor debe ser un número válido",
        min_value: "El valor mínimo permitido es {min}",
        max_value: "El valor máximo permitido es {max}",
      },
      steps: {
        basic: {
          title: "Metas básicas",
          subtitle: "Calorías, proteínas, carbohidratos y grasas",
        },
        limits: {
          title: "Límites adicionales",
          subtitle: "Fibra, azúcar y grasas saturadas",
        },
      },
    },
    recipe: {
      listing: {
        title: "Recetas",
        addButton: "Crear receta",
        noData: "No hay recetas",
      },
      formTitle: {
        create: "Nueva receta",
        edit: "Editar receta",
      },
      formInstructions: "Complete los detalles",
      fields: {
        name: "Nombre",
        description: "Descripción",
        is_favorite: "Favorita",
        image: "Imagen",
        preparation_time: "Tiempo prep. (min)",
        servings: "Porciones",
        calories: "Calorías",
        protein: "Proteína (g)",
        carbs: "Carbohidratos (g)",
        fats: "Grasas (g)",
        fiber: "Fibra (g)",
        sugar: "Azúcar (g)",
        saturated_fats: "Grasas sat. (g)",
        is_private: "Privada",
      },
      validation: {
        required: "{field} es requerido",
        invalid_number: "Número inválido",
        min_servings: "Mínimo 1 porción",
      },
      steps: {
        basic_info: {
          title: "Información básica",
          subtitle: "Datos principales",
        },
        nutrition: {
          title: "Nutrición",
          subtitle: "Valores nutricionales",
        },
        ingredients: {
          title: "Ingredientes",
          subtitle: "Lista de productos",
        },
      },
    },
    recipe_product: {
      listing: {
        title: "Ingredientes de la receta",
        addButton: "Agregar ingrediente",
        noData: "No hay ingredientes agregados",
      },
      formInstructions: "Complete los datos del ingrediente para la receta.",
      steps: {
        basic: {
          title: "Producto y cantidad",
          subtitle:
            "Seleccione un producto y defina la cantidad usada en la receta",
        },
        nutrition: {
          title: "Nutrición",
          subtitle: "Valores nutricionales por unidad",
        },
      },
      formTitle: {
        create: "Agregar ingrediente",
        edit: "Editar ingrediente",
      },
      fields: {
        product_id: "Producto",
        quantity_in_recipe: "Cantidad en receta",
        unit: "Unidad",
        calories_per_unit: "Calorías",
        protein_per_unit: "Proteína",
        carbs_per_unit: "Carbohidratos",
        fats_per_unit: "Grasas",
        fiber_per_unit: "Fibra",
        sugar_per_unit: "Azúcar",
        saturated_fats_per_unit: "Grasas saturadas",
      },
      validation: {
        required: "{field} es requerido",
        invalid_quantity: "La cantidad debe ser un número positivo",
        invalid_nutrient: "El valor debe ser mayor o igual a 0",
      },
    },
    nutrition: {
      profile: "Perfil nutricional",
      recipes: "Recetas",
      dailyLog: "Registro diario",
      meals: "Comidas del día",
    },
    daily_log: {
      listing: {
        title: "Registros diarios",
        noData: "No hay registros para esta persona",
      },
      formInstructions: "Complete la información del registro diario.",
      formTitle: {
        create: "Crear registro diario",
        edit: "Editar registro diario",
      },
      fields: {
        date: "Fecha",
        water_intake: "Ingesta de agua (L)",
        sleep_hours: "Horas de sueño",
        steps: "Pasos",
        notes: "Notas",
      },
      steps: {
        info: {
          title: "Información del registro",
          subtitle: "Datos básicos del día",
        },
      },
      validation: {
        required: "{field} es requerido",
        invalid_date: "La fecha no es válida",
        positive_number: "{field} debe ser un número positivo o cero",
      },
    },
    meal_entry: {
      listing: {
        title: "Comidas del día",
        addButton: "Agregar comida",
        noData: "No hay comidas registradas",
      },
      formInstructions: "Complete los datos de la comida.",
      steps: {
        basic: {
          title: "Tipo de comida y notas",
          subtitle: "Seleccione el tipo de comida y agregue notas opcionales",
        },
        recipes: {
          title: "Recetas",
          subtitle: "Seleccione recetas y defina las raciones consumidas",
        },
      },
      formTitle: {
        create: "Agregar comida",
        edit: "Editar comida",
      },
      fields: {
        type_id: "Tipo de comida",
        notes: "Notas",
      },
      validation: {
        required: "{field} es requerido",
      },
    },
    meal_recipe: {
      listing: {
        title: "Recetas / Ingredientes en la comida",
        addButton: "Agregar receta",
        noData: "No hay recetas agregadas",
      },
      formInstructions:
        "Seleccione una receta y defina las raciones consumidas.",
      steps: {
        basic: {
          title: "Receta y raciones",
          subtitle: "Elija una receta y la cantidad consumida",
        },
      },
      formTitle: {
        create: "Agregar receta a la comida",
        edit: "Editar receta en la comida",
      },
      fields: {
        recipe_id: "Receta",
        servings: "Raciones",
        servings_unit: "raciones",
      },
      validation: {
        required: "{field} es requerido",
        invalid_servings: "Las raciones deben ser un número positivo",
      },
    },
    shoppingList: {
      reason: "Motivo",
      reasons: {
        Agotado: "Agotado",
        "Por agotarse": "Por agotarse",
        Vencido: "Vencido",
        "Por vencer": "Por vencer",
      },
      noSuggestions:
        "No hay productos que requieran reposición en este momento.",
      loadError: "Error al cargar la lista sugerida.",
      createShoppingTask: "Crear tarea de compra",
    },
    snackbar: {
      success: { title: "Éxito" },
      info: { title: "Información" },
      error: { title: "Error" },
      warning: { title: "Advertencia" },
    },
  },
};

export default spanish;
