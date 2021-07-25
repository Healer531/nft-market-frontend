import React from 'react';
import { NavLink } from 'react-router-dom';

import { ROUTES } from '../../core/data/routes';

import '../layout.scss';

export const Footer = () => {

  const pages = [
    {
      name: 'Docs',
      route: ROUTES.news
    }
  ];

  return (
    <div className="height-60 bg-primary border-top-5 mt-30 border-secondary">
      <div className="d-none d-lg-flex h-100">
        <div className="container h-100">
          <div className="d-flex h-100">
            <div className="d-flex align-items-center justify-content-between flex-grow-1 mr-100">
              {
                pages.map((page: any, index) => (
                  <NavLink activeClassName="active" to={ page.route } key={ index }>
                    <span className="font-weight-bold">{ page.name }</span>
                  </NavLink>
                ))
              }
            </div>
            <div className="d-flex align-items-center font-14 text-white">

            </div>
          </div>
        </div>
      </div>
      <div className="d-flex d-lg-none"></div>
    </div>
  );

}
