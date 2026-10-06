const l = (tr, en, es) => [tr, en, es];
const directory = l('HappyCow — işletme kaydı', 'HappyCow — venue listing', 'HappyCow — ficha del local');
const confirm = l('Dizin kaydı menü kategorisini gösterir; güncel menüyü işletmeyle kontrol edin. Alerjen veya çapraz temas güvencesi değildir.', 'The directory identifies the menu category; confirm the current menu with the venue. This is not an allergen or cross-contact guarantee.', 'El directorio indica la categoría de la carta; confirma el menú actual con el local. No garantiza ausencia de alérgenos ni de contacto cruzado.');
const research = l('Bitki bazlı yemeklerde sos, tereyağı, peynir ve balı ayrıca sorun. Helal tercih için et kaynağını ve hazırlamayı işletmeyle doğrulayın; menüdeki bir yemek veya restoranın bulunduğu ülke sertifika kanıtı sayılmaz.', 'Ask separately about sauces, butter, cheese and honey in plant-based dishes. For halal preferences, confirm meat sourcing and preparation with the venue; a dish name or the country where a restaurant operates is not certification.', 'Pregunta por salsas, mantequilla, queso y miel en los platos vegetales. Para halal, confirma la procedencia y preparación de la carne con el local; ni el nombre del plato ni el país equivalen a una certificación.');
const entry = (pick) => ({vegan:[{...pick, sourceName:pick.sourceName ?? directory, sourceType:pick.sourceType ?? 'vegan-directory', note:pick.note ?? confirm}], halal:[], researchNote:research});

// Retain named recommendations only where the linked record supports the venue
// and dietary category. Unverified cards fall back to the city-specific meal notes.
export const dietaryData = {
  AE: {Dubai:entry({
    name:'SEVA Table', status:'fully-vegan',
    cuisine:l('Bitki bazlı kafe','Plant-based cafe','Cafetería vegetal'),
    area:l('Jumeirah 1','Jumeirah 1','Jumeirah 1'),
    description:l('Jumeirah 1’de, bahçe ortamında yemek molası verebileceğiniz bitki bazlı bir kafe. İşletme kendi menüsünü tamamen bitki bazlı olarak tanımlıyor.','A plant-based cafe with a garden setting in Jumeirah 1. The venue describes its menu as entirely plant-based.','Cafetería vegetal con jardín en Jumeirah 1. El propio local presenta su carta como completamente vegetal.'),
    why:l('Şehir gezisine daha sakin bir yemek molası eklemek için düşünebilirsiniz.','An option for a quieter meal during a city sightseeing day.','Una opción para comer con más calma durante las visitas.'),
    sourceName:l('SEVA — işletmenin resmî sitesi','SEVA — official venue website','SEVA — web oficial del local'), sourceType:'restaurant', sourceUrl:'https://www.sevaexperience.com/',
    note:l('Bitki bazlı menü işletmenin resmî sitesinde belirtiliyor. Alerjen ve hazırlama koşullarını ayrıca sorun.','The official website identifies the menu as plant-based. Ask separately about allergens and preparation.','La web oficial identifica la carta como vegetal. Consulta aparte alérgenos y preparación.'),
  })},
  GE: {Tiflis:entry({
    name:'Kiwi Vegan Cafe', status:'fully-vegan',
    cuisine:l('Vegan kafe','Vegan cafe','Cafetería vegana'),
    area:l('Ivane Machabeli Caddesi','Ivane Machabeli Street','Calle Ivane Machabeli'),
    description:l('Machabeli Caddesi’ndeki kafe, HappyCow’da vegan işletme olarak kayıtlı. Merkezde gezerken bitki bazlı bir yemek için bakabileceğiniz adreslerden.','A cafe on Machabeli Street listed as vegan by HappyCow. An option for a plant-based meal while exploring the centre.','Cafetería de la calle Machabeli registrada como vegana en HappyCow. Una opción vegetal durante un paseo por el centro.'),
    why:l('Merkezdeki yürüyüş rotanızla birleştirebilirsiniz; gitmeden güncel menüyü kontrol edin.','Can fit into a central walking route; check the current menu before visiting.','Se puede combinar con un paseo céntrico; consulta la carta actual antes de ir.'),
    sourceUrl:'https://www.happycow.net/reviews/kiwi-vegan-cafe-tbilisi-60107',
  })},
  BG: {Plovdiv:entry({
    name:'Veggic', status:'vegan-options',
    cuisine:l('Vejetaryen mutfak ve vegan seçenekler','Vegetarian food with vegan options','Cocina vegetariana con opciones veganas'),
    area:l('Kapana / Zlatarska Caddesi','Kapana / Zlatarska Street','Kapana / calle Zlatarska'),
    description:l('Kapana’daki Veggic, HappyCow’da vegan seçenekleri bulunan vejetaryen restoran olarak listeleniyor. Mahalle yürüyüşünü burada yemek molasıyla birleştirebilirsiniz.','Veggic in Kapana is listed by HappyCow as vegetarian with vegan options. It can be a meal stop during a neighbourhood walk.','Veggic, en Kapana, figura en HappyCow como vegetariano con opciones veganas. Puede ser una parada para comer mientras paseas por el barrio.'),
    why:l('Kapana’yı gezerken vegan seçenekleri tek tek sorabileceğiniz bir adres.','A place to ask about individual vegan dishes while exploring Kapana.','Un lugar donde preguntar por platos veganos durante la visita a Kapana.'),
    sourceUrl:'https://www.happycow.net/reviews/veggic-plovdiv-62204',
    note:l('Tamamen vegan olarak sunulmuyor; dizinde ballı limonata özellikle belirtiliyor. İçeceklerin ve yemeklerin içeriğini sorun.','Not presented as fully vegan; the directory specifically mentions lemonade containing honey. Check drink and dish ingredients.','No se presenta como totalmente vegano; el directorio menciona limonada con miel. Comprueba ingredientes de bebidas y platos.'),
  })},
  MT: {Valletta:entry({
    name:'Soul Food', status:'vegan-options',
    cuisine:l('Vegan seçenekli karma menü','Mixed menu with vegan options','Carta mixta con opciones veganas'),
    area:l('Merchants Street','Merchants Street','Merchants Street'),
    description:l('Merchants Street’teki restoranın karma menüsünde vegan seçenekler bulunuyor. Tamamen vegan bir işletme arayanlar için bu ayrım önemli.','A restaurant on Merchants Street with vegan choices on a mixed menu. It is not a fully vegan venue.','Restaurante de Merchants Street con opciones veganas en una carta mixta. No es un establecimiento completamente vegano.'),
    why:l('Valletta merkezindeki gezinizde vegan yemek seçeneği araştırmak için bir durak.','An option to investigate for a vegan meal during central Valletta sightseeing.','Una opción que consultar para comer vegano durante las visitas al centro de La Valeta.'),
    sourceUrl:'https://www.happycow.net/reviews/soul-food-valletta-42902',
  })},
  CY: {Baf:entry({
    name:'Meraki Market Cafe', status:'fully-vegan',
    cuisine:l('Vegan kafe','Vegan cafe','Cafetería vegana'),
    area:l('Chloraka','Chloraka','Chloraka'),
    description:l('Chloraka’daki kafe HappyCow’da vegan olarak listeleniyor. Liman bölgesinde değildir; yemek planına eklerken ulaşımını da düşünün.','A cafe in Chloraka listed as vegan by HappyCow. It is outside the harbour area, so include transport in your meal plans.','Cafetería de Chloraka registrada como vegana en HappyCow. Está fuera de la zona del puerto: ten en cuenta el desplazamiento.'),
    why:l('Baf gezisine bitki bazlı bir kafe molası eklemek isteyenler için seçenek.','An option for a plant-based cafe stop during a Paphos stay.','Una opción para una pausa en una cafetería vegetal durante la estancia en Pafos.'),
    sourceUrl:'https://www.happycow.net/reviews/meraki-market-cafe-paphos-125062',
  })},
  MA: {Fes:entry({
    name:'The Ruined Garden', status:'vegan-options',
    cuisine:l('Fas mutfağı ve vegan seçenekler','Moroccan food with vegan options','Cocina marroquí con opciones veganas'),
    area:l('Medina / Derb Idrissy','Medina / Derb Idrissy','Medina / Derb Idrissy'),
    description:l('Medinadaki bahçe restoranı, karma menüsünde vegan seçenekler sunan bir adres olarak listeleniyor. Siparişte vegan olan yemekleri ve günlük bulunurluğu sorun.','A garden restaurant in the medina listed as offering vegan choices alongside a mixed menu. Ask which dishes are vegan and available that day.','Restaurante con jardín en la medina que figura con opciones veganas dentro de una carta mixta. Pregunta qué platos son veganos y están disponibles ese día.'),
    why:l('Medina yürüyüşü sırasında yemek için oturarak mola verebileceğiniz bir seçenek.','An option for a seated meal break during a medina walk.','Una opción para hacer una pausa y comer durante el paseo por la medina.'),
    sourceUrl:'https://www.happycow.net/reviews/the-ruined-garden-fes-188448',
  }), 'Şefşavan':entry({
    name:'Sofia', status:'vegan-options',
    cuisine:l('Fas mutfağı ve vegan seçenekler','Moroccan food with vegan options','Cocina marroquí con opciones veganas'),
    area:l('Outa el Hammam çevresi','Around Outa el Hammam','Entorno de Outa el Hammam'),
    description:l('Ana meydan çevresindeki restoran, HappyCow’da sınırlı vegan seçenekleri olan karma menülü bir işletme olarak kayıtlı. Sebzeli tajinin ve diğer tabakların içeriğini siparişte teyit edin.','A restaurant near the main square listed by HappyCow as having a mixed menu with a few vegan choices. Confirm ingredients in vegetable tagines and other dishes when ordering.','Restaurante cerca de la plaza principal que figura en HappyCow con algunas opciones veganas en una carta mixta. Confirma ingredientes del tajín de verduras y otros platos al pedir.'),
    why:l('Eski şehir yürüyüşüne yemek molası eklerken değerlendirebileceğiniz bir adres.','An option to consider for a meal during an old-town walk.','Una opción para comer durante el paseo por el casco antiguo.'),
    sourceUrl:'https://www.happycow.net/reviews/sofia-chefchaouen-88966',
  })},
};
