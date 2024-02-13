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

function GraphDatesTickets({ tickets }) {
    const ticketsByDay = {};
    tickets.forEach(ticket => {
        const ticketDate = formatDate(ticket._date_creation);
        if (ticketsByDay[ticketDate]) {
            ticketsByDay[ticketDate]++;
        } else {
            ticketsByDay[ticketDate] = 1;
        }
    });

    let labels = Object.keys(ticketsByDay);
    let data = Object.values(ticketsByDay);

    // Trier les dates dans l'ordre chronologique
    labels.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'));
        const dateB = new Date(b.split('/').reverse().join('/'));
        return dateA - dateB;
    });

    // // Limiter à 7 dates maximum
    // if (labels.length > 7) {
    //     labels = labels.slice(labels.length - 7);
    //     data = data.slice(data.length - 7);
    // }

    // Tableau de couleurs fixes
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(231, 233, 237, 0.6)'
    ];

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tickets ouverts par jour',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace(', 0.6', ', 1')), // Mettre l'opacité à 1 pour les bordures
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        // Utilise une fonction pour formater les valeurs de l'axe Y en entiers
                        ticks: {
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [labels, data, backgroundColors]);

    return (
        <div className='graph-container' style={{ height: '20vw', marginTop: '1vw' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default GraphDatesTickets;