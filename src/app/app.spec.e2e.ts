/// <reference types="Cypress" />

import { DOM } from '../../cypress/helpers/dom.helper';
import { hardCodedListings } from './services/listings.data';
import { hardcodedElementsToTestList, FormElement } from '../../cypress/helpers/data.helper';
import { VehicleListing, ListingType } from './interfaces/listing.interface';
import { Spaceship, Speeder } from './interfaces/vehicle.interface';
import { DroidType } from './interfaces/droid.interface';

context(`EJawa demo`, () => {
  beforeEach(() => {
    cy.visit('');
  });

  it(`should have a default list displayed`, () => {
    DOM.list.objList.should('eql', hardcodedElementsToTestList(hardCodedListings));
  });

  it(`should click on the first element and display its data in the form`, () => {
    DOM.list.elements.cy.first().click();

    const x = hardCodedListings[0] as VehicleListing;
    const v = x.product as Spaceship;

    const expectedObj: FormElement = {
      title: x.title,
      price: '£' + x.price.toLocaleString(),
      inputs: {
        id: x.id,
        title: x.title,
        imageUrl: x.imageUrl,
        price: x.price + '',
        listingType: x.listingType,
        vehiculeForm: {
          vehiculeType: x.product.vehicleType,
          spaceshipForm: {
            color: v.color,
            canFire: v.canFire,
            numberOfWings: v.numberOfWings,
            numberOfPeopleOnBoard: v.numberOfPeopleOnBoard,
          },
        },
      },
    };

    DOM.form.obj.should('eql', expectedObj);
  });

  it(`should be able to go from a spaceship to a speeder and update the form`, () => {
    DOM.list.elements.cy.eq(0).click();
    DOM.list.elements.cy.eq(1).click();

    const x = hardCodedListings[1] as VehicleListing;
    const v = x.product as Speeder;

    const expectedObj: FormElement = {
      title: x.title,
      price: '£' + x.price.toLocaleString(),
      inputs: {
        id: x.id,
        title: x.title,
        imageUrl: x.imageUrl,
        price: x.price + '',
        listingType: x.listingType,
        vehiculeForm: {
          vehiculeType: x.product.vehicleType,
          speederForm: {
            color: v.color,
            canFire: v.canFire,
            numberOfPeopleOnBoard: v.numberOfPeopleOnBoard,
            maximumSpeed: v.maximumSpeed,
          },
        },
      },
    };

    DOM.form.obj.should('eql', expectedObj);
  });

  it(`should display the (nested) errors from the form`, () => {
    DOM.createNewButton.click();

    DOM.form.errors.should('eql', {
      listingType: {
        required: true,
      },
      title: {
        required: true,
      },
      imageUrl: {
        required: true,
      },
      price: {
        required: true,
      },
    });

    DOM.form.elements.selectListingTypeByType(ListingType.DROID);

    DOM.form.errors.should('eql', {
      droidProduct: {
        droidType: {
          required: true,
        },
      },
      title: {
        required: true,
      },
      imageUrl: {
        required: true,
      },
      price: {
        required: true,
      },
    });

    DOM.form.elements.droidForm.selectDroidTypeByType(DroidType.ASSASSIN);

    DOM.form.errors.should('eql', {
      droidProduct: {
        assassinDroid: {
          color: {
            required: true,
          },
          name: {
            required: true,
          },
          weapons: {
            required: true,
          },
        },
      },
      title: {
        required: true,
      },
      imageUrl: {
        required: true,
      },
      price: {
        required: true,
      },
    });

    DOM.form.elements.droidForm.name.type(`IG-86 sentinel`);

    DOM.form.errors.should('eql', {
      droidProduct: {
        assassinDroid: {
          color: {
            required: true,
          },
          weapons: {
            required: true,
          },
        },
      },
      title: {
        required: true,
      },
      imageUrl: {
        required: true,
      },
      price: {
        required: true,
      },
    });
  });
});