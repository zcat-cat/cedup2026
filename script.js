const HORARIOS = {

      // MANHÃ
      manha: {
        dias: ["Seg", "Ter", "Qua", "Qui", "Sex"],
        diasNum: [1, 2, 3, 4, 5],
        aulas: [
          ["7:45",   "Inglês|Jhonatan",   "Geografia|Cida",           "PPW|Lucas",            "Português|Talita",     "Soc. Trabalho|Rosiane" ],
          ["8:30",   "Inglês|Jhonatan",   "Biologia|Débora",          "PPW|Lucas",            "Português|Talita",     "Soc. Trabalho|Rosiane" ],
          ["9:15",   "História|Darlan",   "Sociologia|Rosiane",       "PPW|Lucas",            "Física|Letícia",       "Português|Talita"      ],
          ["10:15",  "Ed. Física|Mario",  "Soc. Trabalho|Rosiane",    "Filosofia|Bárbara",    "Física|Letícia",       "Ed. Física|Mario"      ],
          ["11:00",  "História|Darlan",   "Português|Talita",         "Biologia|Débora",      "Matemática|Silvana",   "Redes|Magaiver"        ],
        ]
      },

      // TARDE
      tarde: {
        dias: ["Seg", "Qui", "Sex"],
        diasNum: [1, 4, 5],
        aulas: [
          ["13:15",  "PAP|Matheus",       "Matemática|Silvana",    "Redes|Magaiver"    ],
          ["14:00",  "Filosofia|Bárbara", "PAP|Matheus",           "Arte|Inês"         ],
          ["14:45",  "LPL|Julcemar",      "Geografia|Cida",        "Matemática|Silvana"],
          ["15:45",  "LPL|Julcemar",      "Química|Otto",          "Matemática|Silvana"],
          ["16:30",  "LPL|Julcemar",      "Química|Otto",          "Arte|Inês"         ],
        ]
      }
    };

    // CATEGORIAS DAS MATÉRIAS
    const CATEGORIAS = {
      "Português":    "lang",
      "Inglês":       "lang",
      "Ed. Física":   "phys",
      "Soc. Trabalho":"tech",
      "Redes":        "tech",
      "PPW":          "tech",
      "PAP":          "tech",
      "LPL":          "tech",
      "Matemática":   "science",
      "Física":       "science",
      "Biologia":     "science",
      "Química":      "science",
      "Sociologia":   "human",
      "Geografia":    "human",
      "Filosofia":    "human",
      "História":     "human",
      "Arte":         "human",
    };

    // Nomes para a legenda (categoria -> rótulo exibido)
    const LEGENDA = {
      "lang":    "Linguagens",
      "science": "Ciências",
      "math":    "Matemática",
      "tech":    "Técnicas",
      "human":   "Humanas",
      "phys":    "Físico",
      "art":     "Arte",
      "social":  "Soc. Trabalho",
    };


    function renderSchedule(containerId, data) {
      const container = document.getElementById(containerId);
      const table = document.createElement('table');
      table.className = 'schedule-table';

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const thTime = document.createElement('th');
      thTime.textContent = 'Horário';
      headerRow.appendChild(thTime);

      data.dias.forEach((dia, i) => {
        const th = document.createElement('th');
        th.textContent = dia;
        th.setAttribute('data-day', data.diasNum[i]);
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      data.aulas.forEach(row => {
        const tr = document.createElement('tr');
        const tdTime = document.createElement('td');
        tdTime.textContent = row[0];
        tr.appendChild(tdTime);

        for (let i = 1; i < row.length; i++) {
          const td = document.createElement('td');
          if (row[i]) {
            const parts = row[i].split('|');
            const materia = parts[0].trim();
            const professor = parts[1] ? parts[1].trim() : '';
            const cat = CATEGORIAS[materia] || '';
            const div = document.createElement('div');
            div.className = 'subject' + (cat ? ' cat-' + cat : '');
            div.innerHTML =
              '<span class="subject-name">' + materia + '</span>' +
              (professor ? '<span class="subject-teacher">' + professor + '</span>' : '');
            td.appendChild(div);
          } else {
            td.innerHTML = '<span class="empty-cell">—</span>';
          }
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);
    }

    function renderLegend() {
      const legend = document.getElementById('legend');
      const usedCats = new Set();
      // Descobre quais categorias estão em uso
      Object.values(CATEGORIAS).forEach(cat => usedCats.add(cat));

      Object.entries(LEGENDA).forEach(([cat, label]) => {
        if (!usedCats.has(cat)) return;
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML =
          '<div class="legend-dot" style="background:var(--' + cat + ')"></div>' + label;
        legend.appendChild(item);
      });
    }

    function switchTab(tab) {
      document.querySelectorAll('.schedule').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
      event.target.classList.add('active');
    }

    // Render tables
    renderSchedule('manha', HORARIOS.manha);
    renderSchedule('tarde', HORARIOS.tarde);
    renderLegend();

    // Highlight current day & show date
    (function() {
      const now = new Date();
      const dayIndex = now.getDay();
      const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

      document.getElementById('currentInfo').textContent =
        dayNames[dayIndex] + ', ' + now.getDate() + ' de ' + months[now.getMonth()];

      if (dayIndex >= 1 && dayIndex <= 5) {
        document.querySelectorAll('th[data-day="' + dayIndex + '"]').forEach(th => {
          th.classList.add('current-day-header');
          const colIndex = Array.from(th.parentNode.children).indexOf(th);
          const table = th.closest('table');
          table.querySelectorAll('tbody tr').forEach(row => {
            const cell = row.children[colIndex];
            if (cell) cell.classList.add('current-day');
          });
        });
      }

      // Auto-switch to afternoon tab if past noon
      if (now.getHours() >= 12) {
        document.getElementById('manha').classList.remove('active');
        document.getElementById('tarde').classList.add('active');
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b.textContent === 'Tarde');
        });
      }
    })();