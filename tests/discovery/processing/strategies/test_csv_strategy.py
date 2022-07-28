from io import BytesIO
from werkzeug.datastructures import FileStorage
from slamd.discovery.processing.discovery_persistence import DiscoveryPersistence
from slamd.discovery.processing.models.dataset import Dataset
from slamd.discovery.processing.strategies.csv_strategy import CsvStrategy


def test_create_dataset_parses_file_storage_correctly(monkeypatch):
    headers = 'column1,column2,column3\n'
    content = '1,2,3\n4,5,6\n7,8,9'
    stream = BytesIO(bytes(headers + content, 'utf-8'))
    file_data = FileStorage(filename='TestDataset.csv', stream=stream)
    dataset = CsvStrategy.create_dataset(file_data)
    assert dataset.name == 'TestDataset.csv'
    assert dataset.columns == ['column1', 'column2', 'column3']
    assert dataset.content == content


def test_save_dataset_calls_discovery_persistence(monkeypatch):
    mock_save_dataset_called_with = None

    def mock_save_dataset(dataset):
        nonlocal mock_save_dataset_called_with
        mock_save_dataset_called_with = dataset
        return None

    monkeypatch.setattr(DiscoveryPersistence, 'save_dataset', mock_save_dataset)

    dataset = Dataset(name='TestDataset.csv', columns='column1,column2,column3', content='1,2,3\n4,5,6\n7,8,9')
    CsvStrategy.save_dataset(dataset)
    assert mock_save_dataset_called_with == dataset