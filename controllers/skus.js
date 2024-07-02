
import Sku from '../models/skus.js'

export const findAll = async (req, res) => {
  const { page, pageSize } = req.query;
  console.log(pageSize)
  const itemsToSkip = (page-1)*pageSize;
  try {
    console.log('Received request to fetch skus');
    // totalItems -> quantos itens no total temos?
    // totalPages -> quantas paginas temos? --> total_de_itens / page_size

    const totalSkus = await Sku.countDocuments();
    const totalPages = Math.ceil(totalSkus/pageSize);

    const skus = await Sku
                        .find({}, 'Id ProductId NameComplete ProductRefId ImageUrl')
                        .skip(itemsToSkip)
                        .limit(pageSize);
    // page 1 -> skip 0... (1-10)....quantos itens a pular?
    // page 2 -> skip 10...(itens 11-20)
    // page 3 -> skip 20...(itens 21-30)
    // page n -> skip --> n = page -> skip = (page-1)*pageSize
    console.log('Retrieved skus:', skus);
    const response = {
      "page": page,
      "pageSize": pageSize,
      "totalSkus": totalSkus,
      "totalPages": totalPages,
      "Skus": skus
    }
    res.json(response);
  } catch (err) {
    console.error('Error retrieving skus:', err);
    res.status(500).json({ message: err.message });
  }
};
