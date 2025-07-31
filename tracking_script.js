// Script de Rastreamento - Regulariza Caminhoneiro
// Este script deve ser inserido no site principal para registrar visitas

(function() {
    // Configuração
    const PANEL_URL = 'http://localhost:5000'; // Alterar para URL do painel em produção
    
    // Função para registrar visita
    function trackVisit() {
        try {
            const visitData = {
                page_url: window.location.href,
                referrer: document.referrer || '',
                timestamp: new Date().toISOString()
            };
            
            // Enviar dados via fetch
            fetch(PANEL_URL + '/api/analytics/track-visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitData)
            }).catch(function(error) {
                console.log('Erro ao registrar visita:', error);
            });
        } catch (error) {
            console.log('Erro no script de rastreamento:', error);
        }
    }
    
    // Registrar visita quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }
})();

