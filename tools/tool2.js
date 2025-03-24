document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.href = href;
        });
    });

    // GitHub SVG injection
    const githubIcons = document.querySelectorAll('.github-icon');
    const githubSvg = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.69 9.015 20.805C6 21.36 5.22 19.755 4.98 19.095C4.845 18.75 4.275 17.415 3.78 17.13C3.375 16.905 2.79 16.35 3.765 16.335C4.68 16.32 5.355 17.19 5.58 17.55C6.63 19.275 8.295 18.825 9.075 18.51C9.18 17.73 9.495 17.145 9.84 16.815C7.185 16.485 4.41 15.555 4.41 11.115C4.41 9.885 4.845 8.835 5.58 8.01C5.46 7.68 5.055 6.48 5.67 4.92C5.67 4.92 6.66 4.575 9.015 6.045C9.975 5.79 11.025 5.655 12.075 5.655C13.125 5.655 14.175 5.79 15.135 6.045C17.49 4.575 18.48 4.92 18.48 4.92C19.095 6.48 18.69 7.68 18.57 8.01C19.305 8.835 19.74 9.885 19.74 11.115C19.74 15.57 16.95 16.485 14.28 16.815C14.715 17.22 15.09 17.985 15.09 19.11C15.09 20.685 15.075 22.41 15.075 22.815C15.075 23.13 15.3 23.505 15.915 23.385C20.565 21.795 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="var(--primary-cyan)"/>
        </svg>
    `;
    githubIcons.forEach(icon => {
        icon.innerHTML = githubSvg;
    });

    // Color conversion logic
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const colorPicker = document.getElementById('colorPicker');
    const status = document.getElementById('status');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // HEX to RGB
    const hexToRgb = (hex) => {
        hex = hex.replace('#', '');
        if (hex.length !== 6) return null;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    };

    // RGB to HEX
    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    };

    // RGB to HSL
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    // HSL to RGB
    const hslToRgb = (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };

    // Update all fields
    const updateColors = (source) => {
        let rgb, hsl, hex;
        try {
            if (source === 'hex') {
                hex = hexInput.value;
                if (!hex.match(/^#[0-9A-F]{6}$/i)) throw new Error('Invalid HEX');
                rgb = hexToRgb(hex);
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            } else if (source === 'rgb') {
                const rgbValues = rgbInput.value.split(',').map(v => parseInt(v.trim()));
                if (rgbValues.length !== 3 || rgbValues.some(v => isNaN(v) || v < 0 || v > 255)) throw new Error('Invalid RGB');
                rgb = { r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] };
                hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            } else if (source === 'hsl') {
                const hslValues = hslInput.value.split(',').map(v => parseInt(v.trim()));
                if (hslValues.length !== 3 || isNaN(hslValues[0]) || hslValues[0] < 0 || hslValues[0] > 360 ||
                    isNaN(hslValues[1]) || hslValues[1] < 0 || hslValues[1] > 100 ||
                    isNaN(hslValues[2]) || hslValues[2] < 0 || hslValues[2] > 100) throw new Error('Invalid HSL');
                hsl = { h: hslValues[0], s: hslValues[1], l: hslValues[2] };
                rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
                hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            } else if (source === 'picker') {
                hex = colorPicker.value;
                rgb = hexToRgb(hex);
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            }

            hexInput.value = hex;
            rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
            colorPicker.value = hex;
            status.textContent = 'Color updated successfully!';
        } catch (error) {
            status.textContent = error.message || 'Invalid input. Please check your values.';
        }
    };

    // Event listeners for inputs
    hexInput.addEventListener('input', () => updateColors('hex'));
    rgbInput.addEventListener('input', () => updateColors('rgb'));
    hslInput.addEventListener('input', () => updateColors('hsl'));
    colorPicker.addEventListener('input', () => updateColors('picker'));

    // Copy to clipboard functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const textToCopy = targetInput.value;

            navigator.clipboard.writeText(textToCopy).then(() => {
                status.textContent = `${targetId.replace('Input', '')} copied to clipboard!`;
            }).catch(err => {
                status.textContent = 'Failed to copy to clipboard.';
                console.error('Clipboard error:', err);
            });
        });
    });

    // Initialize with a default color
    hexInput.value = '#00FFFF';
    updateColors('hex');
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});
