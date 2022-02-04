// More on roles, https://admin.forem.com/docs/forem-basics/user-roles
function openCreditsModal() {
  cy.findByRole('dialog', { name: 'modal' }).should('not.exist');
  cy.findByRole('button', { name: 'Adjust balance' }).click();

  return cy.findByRole('dialog', { name: 'modal' });
}

// function closeUserUpdatedMessage() {
//   cy.findByText('User has been updated').should('exist');
//   cy.findByRole('button', { name: 'Close' }).click();
//   cy.findByText('User has been updated').should('not.exist');
// }

describe('Manage User Credits', () => {
  describe('As an admin', () => {
    beforeEach(() => {
      10;
      cy.testSetup();
      cy.fixture('users/adminUser.json').as('user');
      cy.get('@user').then((user) => {
        cy.loginAndVisit(user, '/admin/users/8');
      });
    });

    it('should add credits', () => {
      cy.findByTestId('user-credits').should('have.text', '100');

      openCreditsModal().within(() => {
        cy.findByRole('combobox', { name: 'Adjust balance' }).select('Add');
        cy.findByRole('spinbutton', {
          name: 'Amount of credits to add or remove',
        }).type('10');
        cy.findByRole('textbox', {
          name: 'Why are you adjusting credits?',
        }).type('some reason');
        cy.findByRole('button', { name: 'Adjust' }).click();
      });

      cy.findByRole('dialog', { name: 'modal' }).should('not.exist');
      // closeUserUpdatedMessage(); // TODO
      cy.findByTestId('user-credits').should('have.text', '210');
    });

    it('should remove credits', () => {
      cy.findByTestId('user-credits').should('have.text', '100');

      openCreditsModal().within(() => {
        cy.findByRole('combobox', { name: 'Adjust balance' }).select('Remove');
        cy.findByRole('spinbutton', {
          name: 'Amount of credits to add or remove',
        }).type('1');
        cy.findByRole('textbox', {
          name: 'Why are you adjusting credits?',
        }).type('some reason');
        cy.findByRole('button', { name: 'Adjust' }).click();
      });

      cy.findByRole('dialog', { name: 'modal' }).should('not.exist');
      // closeUserUpdatedMessage(); // TODO
      cy.findByTestId('user-credits').should('have.text', '89');
    });

    it('should note remove more credits than a user has', () => {
      cy.findByTestId('user-credits').should('have.text', '100');

      openCreditsModal().within(() => {
        cy.findByRole('combobox', { name: 'Adjust balance' }).select('Remove');
        cy.findByRole('spinbutton', {
          name: 'Amount of credits to add or remove',
        }).type('10');
        cy.findByRole('textbox', {
          name: 'Why are you adjusting credits?',
        }).type('some reason');
        cy.findByRole('button', { name: 'Adjust' }).click();
      });

      cy.findByRole('dialog', { name: 'modal' }).should('not.exist');
      // closeUserUpdatedMessage(); // TODO
      cy.findByTestId('user-credits').should('have.text', '0');
    });
  });
});
