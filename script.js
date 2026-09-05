document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    const checkboxes = document.querySelectorAll('.lesson-checkbox');
    const totalCountEl = document.getElementById('total-count');
    const completedCountEl = document.getElementById('completed-count');
    const mainProgressEl = document.getElementById('main-progress');
    const progressTextEl = document.getElementById('progress-text');
    
    // Total items
    const totalItems = checkboxes.length;
    totalCountEl.textContent = totalItems;
    
    // Load from local storage
    loadProgress();
    
    // Accordion Logic
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const content = item.querySelector('.accordion-content');
            
            // Toggle current
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    // Checkbox Logic
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            saveProgress();
            updateStats();
            updateSectionStats(checkbox.dataset.section);
        });
    });
    
    // Make li clickable to toggle checkbox
    window.toggleCheckbox = function(id) {
        const checkbox = document.getElementById(id);
        checkbox.checked = !checkbox.checked;
        
        // Trigger change event manually
        const event = new Event('change');
        checkbox.dispatchEvent(event);
    };
    
    // Buttons
    document.getElementById('expand-all').addEventListener('click', () => {
        accordionItems.forEach(item => {
            item.classList.add('active');
            const content = item.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + "px";
        });
    });
    
    document.getElementById('collapse-all').addEventListener('click', () => {
        accordionItems.forEach(item => {
            item.classList.remove('active');
            const content = item.querySelector('.accordion-content');
            content.style.maxHeight = null;
        });
    });
    
    document.getElementById('reset-all').addEventListener('click', () => {
        if(confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến độ học tập?')) {
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
            saveProgress();
            updateStats();
            
            // Update all section stats
            document.querySelectorAll('.accordion-item').forEach(item => {
                updateSectionStats(item.dataset.sectionIndex);
            });
        }
    });
    
    // Open first section by default
    if(accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
        const content = accordionItems[0].querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + "px";
    }
    
    // Helper functions
    function saveProgress() {
        const progress = {};
        checkboxes.forEach(cb => {
            progress[cb.id] = cb.checked;
        });
        localStorage.setItem('web101x_progress', JSON.stringify(progress));
    }
    
    function loadProgress() {
        const saved = localStorage.getItem('web101x_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            checkboxes.forEach(cb => {
                if (progress[cb.id]) {
                    cb.checked = true;
                }
            });
        }
        
        updateStats();
        
        // Initial section stats update
        document.querySelectorAll('.accordion-item').forEach(item => {
            updateSectionStats(item.dataset.sectionIndex);
        });
    }
    
    function updateStats() {
        const completedCount = document.querySelectorAll('.lesson-checkbox:checked').length;
        completedCountEl.textContent = completedCount;
        
        const percentage = Math.round((completedCount / totalItems) * 100) || 0;
        mainProgressEl.style.width = percentage + '%';
        progressTextEl.textContent = percentage + '%';
    }
    
    function updateSectionStats(sectionIndex) {
        const item = document.querySelector(`.accordion-item[data-section-index="${sectionIndex}"]`);
        if (!item) return;
        
        const sectionCheckboxes = item.querySelectorAll('.lesson-checkbox');
        const totalSection = sectionCheckboxes.length;
        const completedSection = item.querySelectorAll('.lesson-checkbox:checked').length;
        
        const progressEl = item.querySelector('.section-progress');
        progressEl.textContent = `${completedSection}/${totalSection}`;
        
        if (completedSection === totalSection && totalSection > 0) {
            progressEl.classList.add('completed');
        } else {
            progressEl.classList.remove('completed');
        }
    }
});
