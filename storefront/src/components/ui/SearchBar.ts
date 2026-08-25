export function renderSearchBar(): string {
  return `
    <div class="search-bar-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input 
          type="text" 
          id="search-input" 
          class="search-input body" 
          placeholder="Aaj kya khayenge?" 
          aria-label="Search products"
        />
        <button id="search-clear" class="search-clear hidden" aria-label="Clear search">
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

export function setupSearchBar(onSearch: (query: string) => void): void {
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const clearBtn = document.getElementById('search-clear') as HTMLButtonElement | null;

  if (!input || !clearBtn) return;

  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.trim();
    
    if (value.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
    
    onSearch(value.toLowerCase());
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    onSearch('');
    input.focus();
  });
}
