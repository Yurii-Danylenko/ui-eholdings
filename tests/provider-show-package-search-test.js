import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ProviderShowPage from './pages/provider-show';

describeApplication.only('ProviderShow package search', () => {
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', {
      providerId: provider.id
    }).models;

    packages.forEach((p, i) => p.update({
      name: `Package ${i}`,
      contentType: 'Print'
    }));

    packages[2].update({
      name: 'Ordinary Package',
      contentType: 'eBook',
      isSelected: false
    });

    packages[4].update({
      name: 'Other Ordinary Package',
      isSelected: true
    });

    return this.visit(`/eholdings/providers/${provider.id}`, () => {
      expect(ProviderShowPage.$root).to.exist;
    });
  });

  describe('clicking the search button', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch();
    });

    it('shows the package search modal', () => {
      expect(ProviderShowPage.searchModal.isPresent).to.be.true;
    });

    it('shows empty text field', () => {
      expect(ProviderShowPage.searchModal.searchFieldValue).to.equal('');
    });

    it('has default filters selected', () => {
      expect(ProviderShowPage.searchModal.getFilter('sort')).to.equal('relevance');
      expect(ProviderShowPage.searchModal.getFilter('selected')).to.equal('all');
      expect(ProviderShowPage.searchModal.getFilter('type')).to.equal('all');
    });

    it('does not display badge', () => {
      expect(ProviderShowPage.filterBadge).to.be.false;
    });
  });

  describe('clicking the apply button', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch();
    });

    describe('no input in search', () => {
      beforeEach(() => {
        return ProviderShowPage.searchModal.search('');
      });

      it('disables search button', () => {
        expect(ProviderShowPage.searchModal.searchDisabled).to.be.true;
      });

      // it('does nothing with enter is pressed', () => {
      //
      // });

      // it('does not display apply button', () => {
      //   expect(ProviderShowPage.searchModal.hasApplyButton).to.be.false;
      // });
    });

    describe('with search input', () => {
      beforeEach(() => {
        return ProviderShowPage.searchModal.search('other');
      });

      // it('shows apply button', () => {
      //   expect(ProviderShowPage.searchModal.hasApplyButton).to.be.true;
      // });

      it('enables search button', () => {
        expect(ProviderShowPage.searchModal.searchDisabled).to.be.false;
      });
    });
  });

  describe('searching for specific packages', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch()
        .searchModal.search('other ordinary');
    });

    it('displays packages matching the search term', () => {
      expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
      expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      expect(ProviderShowPage.packageList(1).name).to.equal('Ordinary Package');
    });

    it('displays the number of relevant package records', () => {
      expect(ProviderShowPage.searchResultsCount).to.equal('2 records found');
    });

    it('displays updated filter count', () => {
      expect(ProviderShowPage.numFilters).to.equal('1');
    });

    describe('then sorting by package name', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('sort', 'name');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
      });

      it('displays packages matching the search term ordered by name', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
        expect(ProviderShowPage.packageList(1).name).to.equal('Other Ordinary Package');
      });
    });

    describe('then filtering the packages by selection status', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('selected', 'true');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
      });

      it('displays selected packages matching the search term', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      });

      it('displays updated filter count', () => {
        expect(ProviderShowPage.numFilters).to.equal('2');
      });
    });

    describe('then filtering the packages by content type', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('type', 'ebook');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
      });

      it('displays packages matching the search term and content type', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
      });
      it('displays updated filter count', () => {
        expect(ProviderShowPage.numFilters).to.equal('2');
      });
    });
  });
});
