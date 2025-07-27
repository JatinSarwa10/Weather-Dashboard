
        function updateTime() {
            const now = new Date();
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');
            
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short' 
            });
            
            timeElement.textContent = timeString;
            dateElement.textContent = dateString;
        }

        function toggleDarkMode() {
            const toggle = document.querySelector('.toggle-switch');
            toggle.classList.toggle('active');
            
            if (!toggle.classList.contains('active')) {
                document.body.style.background = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
            } else {
                document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)';
            }
        }

        function getCurrentLocation() {
            const button = document.querySelector('.current-location');
            button.textContent = '📍 Getting location...';
            
            setTimeout(() => {
                button.textContent = '🎯 Current Location';
                // Here you would typically use geolocation API
                console.log('Getting current location...');
            }, 2000);
        }

        // Search functionality
        document.querySelector('.search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const city = this.value;
                if (city) {
                    document.querySelector('.city-name').textContent = city;
                    this.value = '';
                    console.log('Searching for:', city);
                }
            }
        });

        // Initialize
        updateTime();
        setInterval(updateTime, 1000);

        // Add some interactive animations
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Weather icon animation on click
        document.querySelector('.weather-icon').addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'float 3s ease-in-out infinite';
            }, 10);
        });
