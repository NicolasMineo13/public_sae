import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GraphStatutsTickets = ({ nbTicketsNouveaux, nbTicketsEnCours, nbTicketsEnAttente, nbTicketsResolus, nbTicketsClos }) => {
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
                labels: ['Nouveaux', 'En cours', 'En attente', 'Résolus', 'Clos'],
                datasets: [{
                    label: 'Statut des tickets',
                    data: [nbTicketsNouveaux, nbTicketsEnCours, nbTicketsEnAttente, nbTicketsResolus, nbTicketsClos],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
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
    }, [nbTicketsNouveaux, nbTicketsEnCours, nbTicketsResolus, nbTicketsClos]);

    return (
        <div className='graph-container' style={{ height: '20vw', marginTop: '1vw' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default GraphStatutsTickets;
