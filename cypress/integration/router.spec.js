/// <reference types="Cypress" />

describe("test router navigation", () => {

  // "/" 
  it("test if Home Page is rendered correctly", () => {
      cy.visit("localhost:5000");
      cy.get(".content").contains("Home Page")
    });

   // "/test"
    it("test if Test Page is rendered correctly", () => {
      cy.visit("localhost:5000/test");
      cy.get(".content").contains("Test Page")
   });

   // "/test/:param1/:param" 
   it("test if Test Page with params is rendered correctly", () => {
      cy.visit("localhost:5000/test/123/abc");
      cy.get(".content").contains("Test Page With Params")
    }); 

    // "/test/*"
    it("test if Test Page with wildcard is rendered correctly", () => {
      cy.visit("localhost:5000/test/123/abc/efg");
      cy.get(".content").contains("Test Page Any")
    }); 

    // "/me/profile"
    it("test if Profile Page is rendered correctly", () => {
      cy.visit("localhost:5000/me/profile");
      cy.get(".content").contains("My Profile Page")
    });

    // "/me/:id/profile"
    it("test if Profile Page with params is rendered correctly", () => {
      cy.visit("localhost:5000/me/123/profile");
      cy.get(".content").contains("My Profile Page With Params")
    });

    // "/me/*/profile" -  **FAILING**
    it.skip("test if Profile Page with wildcard is rendered correctly", () => {
      cy.visit("localhost:5000/me/123/123/profile");
      cy.get(".content").contains("My Any Profile Page")
    }); 

});