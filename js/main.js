const selectPeriod = document.getElementById('selectPeriod');
const selectSubject = document.getElementById('selectSubject');
const kpiContainer  = document.getElementById('kpiCards');
const trendCtx      = document.getElementById('chartTrend').getContext('2d');
const passFailCtx   = document.getElementById('chartPassFail').getContext('2d');
const top5List      = document.getElementById('top5List');

let chartTrend, chartPassFail;

function calculateKPIs(d) {
  const N = d.avg.length;
  const avgTotal = +(d.avg.reduce((a,b)=>a+b,0)/N).toFixed(2);
  const totalPass = d.pass.reduce((a,b)=>a+b,0);
  const totalFail = d.fail.reduce((a,b)=>a+b,0);
  const ratePass = +((totalPass/(totalPass+totalFail))*100).toFixed(1);
  const variance = d.avg.reduce((a,v)=>a+Math.pow(v-avgTotal,2),0)/N;
  const stdDev = +Math.sqrt(variance).toFixed(2);
  const rawTotal = totalPass + totalFail;
  const totalStudents = Math.min(rawTotal, 200);
  const attendanceAvg = +(d.attendance.reduce((a,b)=>a+b,0)/d.attendance.length).toFixed(1);
  return { avgTotal, ratePass, stdDev, totalStudents, attendanceAvg };
}

function renderKPIs(kpis) {
  kpiContainer.innerHTML = `
    <div class="bg-white p-4 rounded shadow">
      <div class="text-sm text-gray-500">Promedio General</div>
      <div class="text-3xl font-bold text-blue-600">${kpis.avgTotal}</div>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <div class="text-sm text-gray-500">Estudiantes Aprobados</div>
      <div class="text-3xl font-bold text-green-600">${kpis.ratePass}%</div>
      <div class="text-sm text-gray-500">${Math.round(kpis.totalStudents * kpis.ratePass/100)} de ${kpis.totalStudents}</div>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <div class="text-sm text-gray-500">Asistencia Promedio</div>
      <div class="text-3xl font-bold text-purple-600">${kpis.attendanceAvg}%</div>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <div class="text-sm text-gray-500">Total Estudiantes</div>
      <div class="text-3xl font-bold text-orange-600">${kpis.totalStudents}</div>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <div class="text-sm text-gray-500">Desviación Estándar</div>
      <div class="text-3xl font-bold text-gray-700">${kpis.stdDev}</div>
    </div>
  `;
}

function renderTop5(students) {
  const top = students
    .map(s => ({ ...s, delta: (s.avgNow - s.avgPrev).toFixed(2) }))
    .sort((a, b) => b.avgNow - a.avgNow)
    .slice(0, 5);

  top5List.innerHTML = top.map((s, i) => `
    <li class="border p-3 rounded flex justify-between items-center">
      <div>
        <span class="font-semibold">${i + 1}. ${s.nombre}</span><br>
        <span class="text-sm text-gray-500">${s.materias} materias</span>
      </div>
      <div class="text-right">
        <div class="text-xl font-bold">${s.avgNow}</div>
        <div class="text-sm">${s.delta > 0 ? '▲ Mejorando' : s.delta < 0 ? '▼ Bajando' : '→ Estable'}</div>
      </div>
    </li>
  `).join('');
}

function updateCharts() {
  const subject = selectSubject.value;
  const period = selectPeriod.value;
  const d = dataStore[subject][period];

  const kpis = calculateKPIs(d);
  renderKPIs(kpis);
  renderTop5(d.students);

  if (chartTrend) chartTrend.destroy();
  chartTrend = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Promedio de Notas',
        data: d.avg,
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 10 }
      },
      plugins: {
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });

  if (chartPassFail) chartPassFail.destroy();
  const passRatio = d.pass.map((c, i) => +((c / (c + d.fail[i])) * 100).toFixed(1));
  chartPassFail = new Chart(passFailCtx, {
    data: {
      labels: d.labels,
      datasets: [
        { type: 'bar', label: 'Aprobados', data: d.pass, backgroundColor: '#16a34a' },
        { type: 'bar', label: 'Reprobados', data: d.fail, backgroundColor: '#dc2626' },
        { type: 'line', label: '% Aprobación', data: passRatio, yAxisID: 'percent', fill: false, tension: 0.3, borderWidth: 2, pointRadius: 3 }
      ]
    },
    options: {
      scales: {
        count: { position: 'left', beginAtZero: true },
        percent: {
          position: 'right',
          beginAtZero: true,
          max: 100,
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

selectPeriod.addEventListener('change', updateCharts);
selectSubject.addEventListener('change', updateCharts);
updateCharts();
