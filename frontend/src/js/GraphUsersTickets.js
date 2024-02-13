import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GraphUsersTickets = ({ tickets, userDetails }) => {
    const analyzeTicketsByUserType = () => {
        const ticketsByUserType = {};

        tickets.forEach(ticket => {
            const user = userDetails[ticket._id_utilisateur_demandeur];
            const userName = `${user?._prenom} ${user?._nom}`; // Combine le prénom et le nom

            if (ticketsByUserType[userName]) {
                ticketsByUserType[userName]++;
            } else {
                ticketsByUserType[userName] = 1;
            }
        });

        // Trier par ordre décroissant de nombre de tickets et limiter à 5 utilisateurs maximum
        const sortedUsers = Object.keys(ticketsByUserType).sort((a, b) => ticketsByUserType[b] - ticketsByUserType[a]).slice(0, 5);
        const filteredTicketsByUserType = {};
        sortedUsers.forEach(user => {
            filteredTicketsByUserType[user] = ticketsByUserType[user];
        });

        return filteredTicketsByUserType;
    };

    const ticketsByUserType = analyzeTicketsByUserType();

    const labels = Object.keys(ticketsByUserType);
    const data = Object.values(ticketsByUserType);

    // Tableau de couleurs fixes
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
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
                    label: 'Tickets par demandeur',
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
};

export default GraphUsersTickets;