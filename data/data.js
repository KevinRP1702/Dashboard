const dataStore = {
  "Matemáticas": {
    mensual: {
      labels: ['Ene','Feb','Mar','Abr','May','Jun'],
      avg:   [9.2, 6.8, 4.5, 8.7, 7.3, 5.9],
      pass:  [92, 68, 45, 87, 73, 59],
      fail:  [8, 32, 55, 13, 27, 41],
      attendance: [95, 88, 70, 92, 85, 78],
      students: [
        { nombre:'Ana García', materias:6, avgNow:9.8, avgPrev:9.4 },
        { nombre:'Carlos López', materias:6, avgNow:9.6, avgPrev:9.3 },
        { nombre:'María Rodríguez', materias:6, avgNow:9.5, avgPrev:9.5 },
        { nombre:'Juan Martínez', materias:6, avgNow:9.4, avgPrev:9.0 },
        { nombre:'Laura Sánchez', materias:6, avgNow:9.3, avgPrev:9.5 },
        { nombre:'Pedro Díaz', materias:6, avgNow:9.1, avgPrev:8.8 }
      ]
    },
    semestral: { /* ... igual que en tu archivo original ... */ },
    anual: { /* ... */ }
  },
  "Historia": {
    mensual: { /* ... */ },
    semestral: { /* ... */ },
    anual: { /* ... */ }
  },
  "Física": {
    mensual: { /* ... */ },
    semestral: { /* ... */ },
    anual: { /* ... */ }
  }
};
