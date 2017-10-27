import { Meteor } from 'meteor/meteor';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Organizations } from '/imports/api/organizations/organizations.js';


function insertHarvests() {
  Harvests.insert({name: 'Example WAF',
                   url: 'http://sos.maracoos.org/maracoos-iso/',
                   organization: 'MARACOOS',
                   harvest_interval: 1,
                   harvest_type: 'WAF',
                   harvest_contact: 'test@test.com'});
}


function insertUsers() {
  Accounts.createUser({
    username: "admin",
    email: "admin@ioos.us",
    password: Meteor.settings.adminPassword || "testadmin",
    profile:{
      name: "Admin",
      email: "admin@ioos.us",
      organization: "IOOS"
    }
  });
  Roles.addUsersToRoles(Accounts.findUserByEmail('admin@ioos.us'), ['admin', 'approved']);
  Accounts.createUser({
    username: "lcampbell",
    email: "lcampbell@ioos.us",
    password: "bobpass",
    profile:{
      name: "Luke Campbell",
      email: "lcampbell@ioos.us",
      organization: "IOOS"
    }
  });
  Roles.addUsersToRoles(Accounts.findUserByEmail('lcampbell@ioos.us'), ['approved']);
  Accounts.createUser({
    username: "badams",
    email: "badams@ioos.us",
    password: "bobpass",
    profile:{
      name: "Ben Adams",
      email: "badams@ioos.us",
      organization: "IOOS"
    }
  });
  Meteor.users.update({}, {$set:{"emails.0.verified":true}}, {multi: true});
}

function insertOrganizations() {
  Organizations.insert({
    name: "IOOS",
    description: "U.S. Integrated Ocean Observing System",
    url: "http://ioos.us/",
    logo_url: "http://data.ioos.us/ioos_logo.png"
  });
  Organizations.insert({
    name: "AOOS",
    description: "Alaskan Ocean Observing System",
    url: "http://aoos.org",
    logo_url: "http://www.aoos.org/wp-content/uploads/2012/09/AOOS_logo.jpg"
  });
  Organizations.insert({
    name: "CariCOOS",
    description: "CarICOOS is the observing arm of the Caribbean Regional Association for Integrated Coastal Ocean Observing (CaRA) http://cara.uprm.edu/. This effort, funded by the NOAA IOOS office http://ioos.noaa.gov/, is one of eleven coastal observing systems and regional associations which along with federal agencies constitute the national coastal component of the US Integrated Ocean Observing System.",
    url: "http://www.caricoos.org/",
  });
  Organizations.insert({
    name: "CDIP",
    description: "The Coastal Data Information Program (CDIP) measures, analyzes, archives, and disseminates coastal environment data for use by coastal engineers, planners, and managers as well as scientists and mariners.",
    url: "https://cdip.ucsd.edu/",
    logo_url: "http://catalog.ioos.us/static/img/np/cdip.png",
  });
  Organizations.insert({
    name: "CenCOOS",
    description: "The Central and Northern California Ocean Observing System (CeNCOOS) is one of eleven regional associations within the Integrated Ocean Observing System (IOOS) around the nation dedicated to the support of science in the service of marine ecosystem health and resource sustainability.",
    url: "http://www.cencoos.org/",
    logo_url: "http://catalog.ioos.us/static/img/ra/cencoos.jpg"
  });
  Organizations.insert({
    name: "GCOOS",
    description: "The Gulf of Mexico Coastal Ocean Observing System (GCOOS) provides timely information about the environment of the United States portion of the Gulf of Mexico and its estuaries for use by decision-makers, including researchers, government managers, industry, the military, educators, emergency responders, and the general public.",
    url: "http://gcoos.org/",
    logo_url: "http://catalog.ioos.us/static/img/ra/gcoos.jpg"
  });
  Organizations.insert({
    name: "COMT",
    description: "U.S. Integrated Ocean Observing System's Coastal and Ocean Modeling Testbed",
    url: "http://testbed.sura.org/",
    logo_url: "http://data.ioos.us/ioos_logo.png"
  });
  Organizations.insert({
    name: "GLOS",
    description: "GLOS is one of 11 Regional Associations of the Integrated Ocean Observing System (IOOS), working to enhance the ability to collect, deliver, and use ocean and Great Lakes information. IOOS is a partnership among federal, regional, academic and private sector parties that works to provide new tools and forecasts to improve safety, enhance the economy, and protect our environment.",
    url: "http://glos.us/",
    logo_url: "http://data.glos.us/portal/img/gloslogo_2x.png"
  });
  Organizations.insert({
    name: "HF Radar DAC",
    description: "U.S. Integrated Ocean Observing System's HF Radar Data Assembly Center",
    logo_url: "http://data.ioos.us/ioos_logo.png"
  });
  Organizations.insert({
    name: "Glider DAC",
    description: "U.S. Integrated Ocean Observing System's National Glider Data Assembly Center",
    url: "http://gliders.ioos.us/",
    logo_url: "http://gliders.ioos.us/static/img/flying_glider.jpg"
  });
  Organizations.insert({
    name: "MARACOOS",
    description: "Mid-Atlantic Regional Association Coastal and Ocean Observing System",
    url: "http://maracoos.org/",
    logo_url: "https://pbs.twimg.com/profile_images/1384705096/MARACOOS_round_transparent.png"
  });
  Organizations.insert({
    name: "NANOOS",
    description: "The Northwest Association of Networked Ocean Observing Systems (NANOOS) is the Regional Association of the national Integrated Ocean Observing System (IOOS) in the Pacific Northwest, primarily Washington and Oregon. NANOOS has strong ties with the observing programs in Alaska and British Columbia through our common purpose and the occasional overlap of data and products.",
    url: "http://nanoos.org/",
    logo_url: "http://catalog.ioos.us/static/img/ra/nanoos.png"
  });
  Organizations.insert({
    name: "US Navy",
    description: "United States Navy partnering with NOAA and IOOS",
    url: "http://www.public.navy.mil/fltfor/cnmoc/Pages/home.aspx",
    logo_url: "http://catalog.ioos.us/static/img/np/logoNavy.jpg"
  });
  Organizations.insert({
    name: "NOAA NDBC",
    description: "NOAA National Data Buoy Center",
    url: "http://www.ndbc.noaa.gov/",
    logo_url: "http://catalog.ioos.us/static/img/np/NOAA-Transparent-Logo.png"
  });
  Organizations.insert({
    name: "NOAA NOS",
    description: "NOAA National Ocean Service",
    url: "http://oceanservice.noaa.gov/",
    logo_url: "http://catalog.ioos.us/static/img/np/NOAA-Transparent-Logo.png"
  });
  Organizations.insert({
    name: "NERACOOS",
    description: "NERACOOS, the Northeastern Regional Association of Coastal Ocean Observing Systems, is collecting and delivering quality and timely ocean and weather information to users throughout the Northeast United States and Canadian Maritimes. To achieve this, NERACOOS supports integrated coastal and ocean observing and modeling activities that feed user defined information products. NERACOOS works collaboratively with regional and local partners including the Northeast Regional Ocean Council (NROC), a state and federal partnership created by the six New England governors.",
    url: "http://neracoos.org/",
    logo_url: "http://catalog.ioos.us/static/img/ra/neracoos.png"
  });
  Organizations.insert({
    name: "SCCOOS",
    description: "SCCOOS brings together coastal observations in the Southern California Bight to provide information necessary to address issues in climate change, ecosystem preservation and management, coastal water quality, maritime operations, coastal hazards and national security. As a science-based decision support system, SCCOOS works interactively with local, state and federal agencies, resource managers, industry, policy makers, educators, scientists and the general public to provide data, models and products that advance our understanding of the current and future state of our coastal and global environment.",
    url: "http://sccoos.org/"
  });
  Organizations.insert({
    name: "PacIOOS",
    description: "PacIOOS is one of eleven regional observing programs in the U.S. that are supporting the emergence of the U.S. Integrated Ocean Observing System (IOOS) under the National Oceanographic Partnership Program (NOPP). The PacIOOS region includes the U.S. Pacific Region (Hawaii, Guam, American Samoa, Commonwealth of the Northern Mariana Islands), the Pacific nations in Free Association with the U.S. (Republic of the Marshall Islands, Federated States of Micronesia, Republic of Palau), and the U.S. Minor Outlying Islands (Howland, Baker, Johnston, Jarvis, Kingman, Palmyra, Midway, Wake).",
    url: "http://pacioos.org/",
    logo_url: "http://www.pacioos.hawaii.edu/wp-content/uploads/2016/06/PacIOOS-logo-landscape-large.jpg"
  });
  Organizations.insert({
    name: "OceanSITES",
    url: "http://www.oceansites.org/",
    logo_url: "http://catalog.ioos.us/static/img/np/oceansites.gif"
  });
  Organizations.insert({
    name: "SECOORA",
    description: "SECOORA, the Southeast Coastal Ocean Observing Regional Association, is the regional solution to integrating coastal and ocean observing data and information in the Southeast United States. SECOORA is a 501(c)(3) nonprofit incorporated in September 2007 that coordinates coastal and ocean observing activities, and facilitates continuous dialogue among stakeholders so that the benefits from the sustained operation of a coastal and ocean observing system can be realized.",
    url: "http://secoora.org/",
    logo_url: "http://catalog.ioos.us/static/img/ra/secoora.png"
  });
  Organizations.insert({
    name: "USGS",
    description: "United States Geological Survey - Science for a Changing World",
    url: "http://usgs.gov/",
    logo_url: "http://catalog.ioos.us/static/img/np/usgs-logo-color.jpg"
  });
  Organizations.insert({
    name: "Other"
  });
}

// if the database is empty on server start, create some sample data.
Meteor.startup(function() {
  if (Harvests.find().count() === 0) {
    insertHarvests();
  } 

  if(Meteor.users.find().count() === 0) {
    insertUsers();
  }


  if(Organizations.find().count() === 0) {
    insertOrganizations();
  }
});


Meteor.startup(function() {
  if(Meteor.settings.email && Meteor.settings.email.mail_url) {
    process.env.MAIL_URL = process.env.MAIL_URL || Meteor.settings.email.mail_url;
  }

  Accounts.emailTemplates.siteName = "IOOS Harvest Registry";
  Accounts.emailTemplates.from = "ioos.us Administrator <admin@ioos.us>";
  Accounts.emailTemplates.verifyEmail = {
    subject() {
      let siteName = Accounts.emailTemplates.siteName;
      return `Welcome to ${siteName}`;
    },
    text(user, url) {
      let emailAddress   = user.emails[0].address,
      urlWithoutHash = url.replace( '#/verify-email', 'users/verify' ),
      supportEmail   = (Meteor.settings.email && Meteor.settings.email.support_email) || "admin@ioos.us",
      emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
    }
  };
  Accounts.emailTemplates.resetPassword = {
    subject() {
      let siteName = Accounts.emailTemplates.siteName;
      return `${siteName} Password Reset`;
    },
    text(user, url) {
      let urlWithoutHash = url.replace( '#/reset-password', 'users/reset' ),
      emailBody = `Someone has requested a password reset for this account.\n\nPlease proceed to ${urlWithoutHash} to reset your user account password.`;
      return emailBody;
    }
  };


});

