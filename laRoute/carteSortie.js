document.addEventListener('DOMContentLoaded', function() {
    const zelda = document.getElementById('zelda');

    // Placer Zelda à la position de Eldin (point 2)
    zelda.style.top = '20%';
    zelda.style.left = '45%';

    function moveZelda(toX, toY, duration, callback) {
        zelda.style.transition = `all ${duration}s ease`;
        zelda.style.left = toX;
        zelda.style.top = toY;

        if (callback) {
            setTimeout(callback, duration * 1000);
        }
    }

    // Déplacer Zelda de Eldin (point 2) à Faron (point 3)
    setTimeout(function() {
        moveZelda('50%', '80%', 3, function() {
            // Afficher le message de réussite de la quête
            alert("Zelda a atteint Faron et a complété sa quête !");
        });
    }, 0);
});
