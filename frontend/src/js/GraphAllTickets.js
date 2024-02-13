import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Définition d'une fonction pour formater la date au format "dd/mm/YYYY"
const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Les mois commencent à 0
    const year = d.getFullYear();

    // Ajouter un zéro devant les jours et les mois si nécessaire
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    return `${formattedDay}/${formattedMonth}/${year}`;
};

function GraphAllTickets({ tickets }) {
    const ticketsByDay = {};

    tickets.forEach(ticket => {
        const ticketDate = formatDate(ticket._date_creation);
        if (ticketsByDay[ticketDate]) {
            ticketsByDay[ticketDate]++;
        } else {
            ticketsByDay[ticketDate] = 1;
        }
    });

    const labels = Object.keys(ticketsByDay);
    const data = labels.map(label => ticketsByDay[label]);

    // Trier les dates dans l'ordre chronologique
    labels.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'));
        const dateB = new Date(b.split('/').reverse().join('/'));
        return dateA - dateB;
    });

    // Calculer le cumul du nombre de tickets
    const cumulativeData = data.reduce((acc, value) => {
        const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
        acc.push(lastValue + value);
        return acc;
    }, []);

    // Limiter à 7 dates maximum
    let limitedLabels = labels;
    let limitedCumulativeData = cumulativeData;

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: limitedLabels,
                datasets: [{
                    label: 'Nombre total de tickets',
                    data: limitedCumulativeData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Nombre total de tickets'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [limitedLabels, limitedCumulativeData]);

    return (
        <div className='graph-container' style={{ height: '20vw', marginTop: '1vw' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default GraphAllTickets;