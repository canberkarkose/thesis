export const dataTestIds = {
  components: {
    spaceContainer: 'space-container',
    customIconButtonAndText: {
      iconButton: 'custom-icon-button',
      text: 'custom-text',
    },
    infoCard: {
      container: 'info-card-container',
      icon: 'info-card-icon',
      title: 'info-card-title',
      text: 'info-card-text',
    },
    appHeader: {
      container: 'app-header-container',
      logo: 'app-header-logo',
      accountButton: 'app-header-account-button',
      menu: 'app-header-menu',
      menuItemAccount: 'app-header-menu-item-account',
      menuItemLogout: 'app-header-menu-item-logout',
    },
    truncatedText: {
      textElement: 'truncated-text-element',
    },
    dateNavigator: {
      previousButton: 'date-navigator-previous-button',
      nextButton: 'date-navigator-next-button',
      dateDisplay: 'date-navigator-date-display',
      editButton: 'date-navigator-edit-button',
    },
    mealGenerator: {
      container: 'meal-generator-container',
      tab: (mealType: string) => `meal-generator-tab-${mealType}`,
      queryInput: 'meal-generator-query-input',
      minCaloriesInput: 'meal-generator-min-calories-input',
      maxCaloriesInput: 'meal-generator-max-calories-input',
      minSugarInput: 'meal-generator-min-sugar-input',
      maxSugarInput: 'meal-generator-max-sugar-input',
      generateButton: 'meal-generator-generate-button',
      loadingIndicator: 'meal-generator-loading-indicator',
    },
  },
};
