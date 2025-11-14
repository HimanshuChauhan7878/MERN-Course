document.addEventListener('DOMContentLoaded', function() {
    const marginSlider = document.getElementById('margin');
    const marginLeftSlider = document.getElementById('margin-left');
    const marginRightSlider = document.getElementById('margin-right');
    const borderSlider = document.getElementById('border');
    const paddingSlider = document.getElementById('padding');
    
    const boxExample = document.querySelector('.box-model-example');

    const marginValue = document.getElementById('margin-value');
    const marginLeftValue = document.getElementById('margin-left-value');
    const marginRightValue = document.getElementById('margin-right-value');
    const borderValue = document.getElementById('border-value');
    const paddingValue = document.getElementById('padding-value');

    marginSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.marginTop = value;
        boxExample.style.marginBottom = value;
        marginValue.textContent = value;
    });

    marginLeftSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.marginLeft = value;
        marginLeftValue.textContent = value;
    });

    marginRightSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.marginRight = value;
        marginRightValue.textContent = value;
    });

    borderSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.borderWidth = value;
        borderValue.textContent = value;
    });

    paddingSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.padding = value;
        paddingValue.textContent = value;
    });
});
