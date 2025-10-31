// Track scroll depth
export const trackScrollDepth = () => {
  window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

    // Initialize scrollEventsFired if it doesn't exist
    if (!window.scrollEventsFired) {
      window.scrollEventsFired = {};
    }

    [25, 50, 75, 100].forEach(threshold => {
      if (scrollPercent >= threshold && !window.scrollEventsFired?.[threshold]) {
        window.gtag('event', 'scroll_depth', {
          scroll_percentage: threshold,
          page_path: window.location.pathname
        });
        // We can safely use non-null assertion here because we initialized it above
        window.scrollEventsFired![threshold] = true;
      }
    });
  });
};

// Track cohort clicks
export const trackCohortClicks = () => {
  // Foundational cohort tracking
  document.querySelectorAll('[id="foundational-cohort"], .foundational-cohort').forEach(el => {
    el.addEventListener('click', function() {
      window.gtag('event', 'click_foundational_cohort', {
        page_path: window.location.pathname
      });
    });
  });

  // Impact cohort tracking
  document.querySelectorAll('[id="impact-cohort"], .impact-cohort').forEach(el => {
    el.addEventListener('click', function() {
      window.gtag('event', 'click_impact_cohort', {
        page_path: window.location.pathname
      });
    });
  });
};

// Track form submissions
export const trackFormSubmissions = () => {
  // Page 1 form
  document.querySelector('#form-page-1')?.addEventListener('submit', function() {
    window.gtag('event', 'form_page_1_submit', { 
      page_path: window.location.pathname 
    });
  });

  // Page 2 form
  document.querySelector('#form-page-2')?.addEventListener('submit', function() {
    window.gtag('event', 'form_page_2_submit', { 
      page_path: window.location.pathname 
    });
  });

  // Final form
  document.querySelector('#form-final')?.addEventListener('submit', function() {
    window.gtag('event', 'form_final_submit', { 
      page_path: window.location.pathname 
    });
  });
};

// Initialize all tracking
export const initAnalytics = () => {
  trackScrollDepth();
  trackCohortClicks();
  trackFormSubmissions();
};