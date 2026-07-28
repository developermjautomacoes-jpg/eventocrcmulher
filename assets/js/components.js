/**
 * components.js
 * Injeta componentes HTML compartilhados (rodapé, etc.) em todas as páginas.
 * Funciona tanto com file:// quanto com servidor HTTP.
 *
 * ► Para editar o rodapé: altere o HTML dentro de FOOTER_HTML abaixo.
 */

(function () {

    // ── Conteúdo do Rodapé ───────────────────────────────────────────────────
    // Este é o único lugar onde o rodapé está definido.
    var FOOTER_HTML = `
    <footer class="footer">
        <div class="container footer-container">
            <div class="footer-info">
                <h3>CRC Mulher ES</h3>
                <p>Promovendo conexões e a valorização da mulher profissional da contabilidade no Espírito Santo.</p>
            </div>
            <div class="footer-links">
                <h4>Links Rápidos</h4>
                <a href="index.html">Início</a>
                <a href="index.html#programacao">Programação</a>
                <a href="index.html#ingressos">Inscrição</a>
                <a href="politica-de-privacidade.html">Política de Privacidade</a>
                <a href="termos-de-uso.html">Termos de Uso</a>
            </div>
            <div class="footer-social">
                <h4>Siga-nos</h4>
                <div class="social-icons">
                    <a href="https://www.instagram.com/crcesoficial/" target="_blank" class="social-link">
                        <i class="fa-brands fa-instagram"></i>
                        <span>@crcesoficial</span>
                    </a>
                    <a href="https://www.instagram.com/crcmulheres/" target="_blank" class="social-link">
                        <i class="fa-brands fa-instagram"></i>
                        <span>@crcmulheres</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container"
                style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <p style="margin: 0;">© 2026 Comissão da Mulher CRC/ES. Todos os direitos reservados.</p>
                <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.5);">Desenvolvido por</span>
                    <a href="https://www.instagram.com/moniquecoelho.tech" target="_blank" rel="noopener noreferrer">
                        <img src="assets/images/logo-neeko.png" alt="Neeko"
                            style="height: 24px; filter: brightness(0) invert(1); opacity: 0.7; transition: all 0.3s ease;"
                            onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    </a>
                </div>
            </div>
        </div>
    </footer>`;
    // ────────────────────────────────────────────────────────────────────────

    // Injeta o rodapé no marcador #site-footer de qualquer página
    var target = document.getElementById('site-footer');
    if (target) {
        target.outerHTML = FOOTER_HTML;
    }

})();
