document.addEventListener('DOMContentLoaded', function () {

    var animateOnScroll = function () {
        var elems = document.querySelectorAll('.card, .chart-card, .table-container, .data-model-section');
        elems.forEach(function (el) {
            var top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 50) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    var allCards = document.querySelectorAll('.card, .chart-card, .table-container, .data-model-section');
    allCards.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    var page = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });

    var topBtn = document.createElement('button');
    topBtn.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
    topBtn.id = 'backToTopBtn';
    topBtn.title = 'Back to Top';
    topBtn.style.cssText = 'position:fixed;bottom:100px;right:30px;width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#4361ee,#3f37c9);color:#fff;border:none;font-size:1.5rem;cursor:pointer;display:none;z-index:1000;box-shadow:0 4px 15px rgba(67,97,238,0.4);transition:all 0.3s ease;';
    document.body.appendChild(topBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            topBtn.style.display = 'flex';
            topBtn.style.alignItems = 'center';
            topBtn.style.justifyContent = 'center';
        } else {
            topBtn.style.display = 'none';
        }
    });

    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    topBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(67,97,238,0.6)';
    });
    topBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(67,97,238,0.4)';
    });

    var statItems = document.querySelectorAll('.stat-item h2');
    var counted = false;

    function countUp() {
        if (counted) return;
        statItems.forEach(function (el) {
            var txt = el.textContent;
            var num = parseInt(txt.replace(/[^0-9]/g, ''));
            var suffix = txt.replace(/[0-9,]/g, '');
            if (isNaN(num)) return;
            var cur = 0;
            var step = Math.ceil(num / 60);
            var t = setInterval(function () {
                cur += step;
                if (cur >= num) {
                    cur = num;
                    clearInterval(t);
                }
                el.textContent = cur.toLocaleString() + suffix;
            }, 25);
        });
        counted = true;
    }

    window.addEventListener('scroll', function () {
        var sec = document.querySelector('.stats-section');
        if (sec && sec.getBoundingClientRect().top < window.innerHeight - 100) {
            countUp();
        }
    });

    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
        var btn = form.querySelector('button[type="button"]');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
            var valid = true;

            inputs.forEach(function (inp) {
                inp.classList.remove('is-invalid', 'is-valid');
                if (inp.value.trim() === '' && !inp.disabled) {
                    inp.classList.add('is-invalid');
                    valid = false;
                } else {
                    inp.classList.add('is-valid');
                }
            });

            var emails = form.querySelectorAll('input[type="email"]');
            emails.forEach(function (em) {
                if (em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
                    em.classList.remove('is-valid');
                    em.classList.add('is-invalid');
                    valid = false;
                }
            });

            if (valid) {
                showToast('Form validated! In the final project this data will be sent to the API.', 'success');
            } else {
                showToast('Please fill in all required fields correctly.', 'danger');
            }
        });
    });

    function showToast(msg, type) {
        var container = document.getElementById('toast-container') || makeToastBox();
        var div = document.createElement('div');
        var bg = type === 'success' ? '#06d6a0' : type === 'danger' ? '#ef476f' : '#4361ee';
        var ico = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';
        div.style.cssText = 'background:' + bg + ';color:#fff;padding:1rem 1.5rem;border-radius:12px;margin-bottom:0.5rem;box-shadow:0 4px 15px rgba(0,0,0,0.2);display:flex;align-items:center;gap:0.75rem;font-weight:500;transform:translateX(100%);transition:transform 0.3s ease;max-width:400px;';
        div.innerHTML = '<i class="bi ' + ico + '"></i> ' + msg;
        container.appendChild(div);
        setTimeout(function () { div.style.transform = 'translateX(0)'; }, 50);
        setTimeout(function () {
            div.style.transform = 'translateX(100%)';
            setTimeout(function () { div.remove(); }, 300);
        }, 3500);
    }

    function makeToastBox() {
        var box = document.createElement('div');
        box.id = 'toast-container';
        box.style.cssText = 'position:fixed;top:90px;right:20px;z-index:9999;display:flex;flex-direction:column;';
        document.body.appendChild(box);
        return box;
    }

    window.showToast = showToast;

    var tableDivs = document.querySelectorAll('.table-container');
    tableDivs.forEach(function (wrap) {
        var tbl = wrap.querySelector('table');
        if (!tbl) return;
        var search = document.createElement('input');
        search.type = 'text';
        search.className = 'form-control mb-3';
        search.placeholder = 'Search in this table...';
        search.style.cssText = 'border-radius:10px;border:2px solid #e0e0e0;padding:0.6rem 1rem;';
        wrap.insertBefore(search, tbl);
        search.addEventListener('input', function () {
            var val = this.value.toLowerCase();
            tbl.querySelectorAll('tbody tr').forEach(function (row) {
                row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    });

    var darkBtn = document.createElement('button');
    darkBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    darkBtn.title = 'Toggle Dark Mode';
    darkBtn.style.cssText = 'position:fixed;bottom:160px;right:30px;width:50px;height:50px;border-radius:50%;background:#1d1d2c;color:#fff;border:none;font-size:1.2rem;cursor:pointer;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,0.2);transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;';
    document.body.appendChild(darkBtn);

    if (localStorage.getItem('edutrack-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        darkBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    darkBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('edutrack-dark-mode', isDark);
        darkBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    });

    var footerP = document.querySelector('footer p');
    if (footerP) {
        var d = new Date();
        var span = document.createElement('small');
        span.className = 'd-block mt-1';
        span.style.opacity = '0.6';
        span.textContent = 'Last visited: ' + d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        footerP.parentElement.appendChild(span);
    }

});
